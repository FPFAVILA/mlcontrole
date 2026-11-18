import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const FB_API_VERSION = "v18.0";
const FB_PIXEL_ID = "2591578004643429";

const conversionInputSchema = z.object({
  event_name: z.string(),
  event_id: z.string().optional(),
  user_data: z
    .object({
      em: z.array(z.string()).optional(),
      ph: z.array(z.string()).optional(),
      fbp: z.string().optional(),
      fb_login_id: z.string().optional(),
    })
    .optional(),
  custom_data: z.record(z.unknown()).optional(),
  action_source: z.string().optional(),
});

export type SendConversionInput = z.infer<typeof conversionInputSchema>;

interface ConversionEvent {
  event_name: string;
  event_time: number;
  event_id?: string;
  user_data?: {
    em?: string[];
    ph?: string[];
    fbp?: string;
    fb_login_id?: string;
    client_ip_address?: string;
    client_user_agent?: string;
  };
  custom_data?: Record<string, unknown>;
  action_source?: string;
}

export const sendFacebookConversion = createServerFn({ method: "POST" })
  .inputValidator((data) => conversionInputSchema.parse(data))
  .handler(async ({ data }) => {
    const token = process.env["FACEBOOK_CONVERSIONS_API_TOKEN"];
    if (!token) {
      console.warn("[Facebook Conversions] token ausente");
      return { ok: false, error: "token_missing" };
    }

    // O Meta rejeita eventos sem nenhum dado do cliente. Enviamos sempre IP,
    // user agent e o cookie _fbp do navegador como identificadores minimos.
    let clientIp: string | undefined;
    let clientUserAgent: string | undefined;
    let fbpFromCookie: string | undefined;
    try {
      const { getRequest } = await import("@tanstack/react-start/server");
      const request = getRequest();
      const headers = request.headers;
      const forwarded = headers.get("x-forwarded-for");
      clientIp =
        forwarded?.split(",")[0]?.trim() ||
        headers.get("cf-connecting-ip") ||
        headers.get("x-real-ip") ||
        undefined;
      clientUserAgent = headers.get("user-agent") ?? undefined;
      const cookie = headers.get("cookie") ?? "";
      fbpFromCookie = cookie.match(/(?:^|;\s*)_fbp=([^;]+)/)?.[1];
    } catch {
      // Sem contexto de request: seguimos com o que o cliente enviou.
    }

    const event: ConversionEvent = {
      event_name: data.event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: data.event_id,
      action_source: data.action_source ?? "website",
      user_data: {
        ...(data.user_data ?? {}),
        fbp: data.user_data?.fbp ?? fbpFromCookie,
        client_ip_address: clientIp,
        client_user_agent: clientUserAgent,
      },
      custom_data: data.custom_data ?? {},
    };


    const url = `https://graph.facebook.com/${FB_API_VERSION}/${FB_PIXEL_ID}/events?access_token=${token}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [event] }),
      });

      const responseText = await res.text();
      if (!res.ok) {
        console.warn("[Facebook Conversions] erro", res.status, responseText);
        return { ok: false, status: res.status, body: responseText };
      }

      return { ok: true };
    } catch (err) {
      console.warn("[Facebook Conversions] falha de rede", err);
      return { ok: false, error: String(err) };
    }
  });
