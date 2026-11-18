import { useState } from "react";
import { Button } from "@/components/ui/button";
import desc1 from "@/assets/description/desc-1.webp.asset.json";
import desc2 from "@/assets/description/desc-2.webp.asset.json";
import desc3 from "@/assets/description/desc-3.webp.asset.json";
import desc4 from "@/assets/description/desc-4.webp.asset.json";
import desc5 from "@/assets/description/desc-5.webp.asset.json";

const descriptionImages = [
  { src: desc1.url, alt: "Pronto para competir, onde for" },
  { src: desc2.url, alt: "Feito para quem leva o jogo a sério" },
  { src: desc3.url, alt: "Imersão com sensação profissional" },
  { src: desc4.url, alt: "Jogue do seu jeito, com precisão máxima" },
  { src: desc5.url, alt: "Personalização avançada e conforto absoluto" },
];

const details = [
  { label: "É sem fio:", value: "Sim" },
  { label: "Com detecção de movimento:", value: "Sim" },
  { label: "Com Bluetooth:", value: "Sim" },
  { label: "Com vibração:", value: "Sim" },
  { label: "Com touchpad:", value: "Sim" },
];

export function ProductDescription() {
  const [expanded, setExpanded] = useState(false);
  const [imagesExpanded, setImagesExpanded] = useState(false);

  return (
    <div className="mt-8 bg-white rounded-lg p-4 md:p-6">
      <h2 className="text-[18px] md:text-[20px] font-semibold text-[#333] mb-4">Detalhes do produto</h2>

      <div className="space-y-5 mb-5">
        {details.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#f5f5f5] shrink-0">
              <svg className="w-[18px] h-[18px] text-[#666]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className="text-[14px] text-[#333]">
              {d.label} <strong>{d.value}</strong>
            </span>
          </div>
        ))}
      </div>

      <div className="text-[14px] text-[#333] leading-[1.6] mb-2">
        <p>
          Controle DualSense Edge PS5, controle profissional, alta performance e personalização
          completa....
        </p>
      </div>

      <Button
          type="button"
          variant="link"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          className="flex h-auto items-center gap-1 mt-4 p-0 text-[14px] text-ml-blue font-semibold hover:underline"
        >
          {expanded ? "Ver menos detalhes" : "Ver mais detalhes"}
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {expanded ? <polyline points="6 15 12 9 18 15" /> : <polyline points="6 9 12 15 18 9" />}
          </svg>
      </Button>

      {expanded && (
        <div className="mt-4 text-[14px] text-[#333] leading-[1.7] space-y-3">
          <p className="font-bold text-[16px]">Controle Sony DualSense Edge PS5 Sem Fio — Midnight Black CFI-ZCP1WY</p>
          <p>
            Eleve sua experiência de jogo com o <strong>DualSense Edge</strong>, o controle sem fio de alto desempenho da Sony desenvolvido para jogadores que buscam <strong>mais precisão, personalização e controle</strong> durante as partidas.
          </p>
          <p>
            Com acabamento <strong>Midnight Black</strong>, o DualSense Edge combina o conforto e os recursos imersivos do DualSense tradicional com diversas opções de personalização. É possível configurar os comandos, ajustar a sensibilidade dos analógicos e gatilhos, modificar as zonas mortas e criar diferentes perfis para adaptar o controle a cada jogo e estilo de gameplay.
          </p>

          <div className="border-t border-[#eee] my-4" />

          <h3 className="font-bold mt-2">Personalização completa</h3>
          <p>O DualSense Edge permite que você configure o controle de acordo com suas preferências. Os <strong>botões podem ser reconfigurados</strong>, possibilitando colocar diferentes comandos exatamente onde você deseja.</p>
          <p>As configurações podem ser salvas em <strong>perfis personalizados</strong>, permitindo alternar rapidamente entre diferentes configurações sem precisar refazer os ajustes sempre que trocar de jogo.</p>
          <p>O botão <strong>Fn</strong>, combinado com o botão de opções, também oferece acesso rápido ao menu de personalização durante a partida.</p>

          <h3 className="font-bold mt-2">Ajuste de analógicos e gatilhos</h3>
          <p>Para quem busca precisão, o controle permite ajustar a <strong>sensibilidade dos analógicos e suas zonas mortas</strong>, ajudando a adaptar a resposta dos comandos ao estilo de cada jogador.</p>
          <p>Os <strong>gatilhos adaptáveis</strong> também podem ter sua profundidade configurada, permitindo reduzir o curso dos gatilhos para obter respostas mais rápidas em determinados jogos.</p>

          <h3 className="font-bold mt-2">Botões traseiros personalizáveis</h3>
          <p>Um dos principais diferenciais do DualSense Edge são os <strong>botões traseiros reconfiguráveis</strong>.</p>
          <p>Eles podem receber diferentes comandos e colocar ações importantes ao alcance dos dedos, sem que você precise retirar os polegares dos analógicos.</p>
          <p>O produto acompanha <strong>dois estilos diferentes de botões traseiros</strong>, permitindo escolher a configuração que melhor se adapta à sua pegada e ao jogo.</p>

          <h3 className="font-bold mt-2">Recursos imersivos do DualSense</h3>
          <p>O DualSense Edge mantém os principais recursos tecnológicos do DualSense tradicional, incluindo:</p>
          <ul className="list-disc pl-5">
            <li>Resposta tátil (Haptic Feedback)</li>
            <li>Gatilhos adaptáveis</li>
            <li>Microfone integrado</li>
            <li>Controles de movimento</li>
            <li>Experiência sem fio</li>
            <li>Entrada para headset</li>
            <li>Recursos de áudio integrados</li>
          </ul>
          <p>A resposta tátil e os gatilhos adaptáveis proporcionam diferentes níveis de vibração, resistência e tensão de acordo com as ações realizadas no jogo, desde que o título seja compatível com esses recursos.</p>

          <h3 className="font-bold mt-2">Conforto e aderência</h3>
          <p>O formato mantém a ergonomia característica do DualSense, mas o DualSense Edge possui acabamento com <strong>material resistente a escorregamento</strong>, ajudando a proporcionar maior firmeza durante sessões prolongadas de jogo.</p>
          <p>Isso é especialmente interessante para partidas competitivas ou para quem costuma jogar por várias horas.</p>

          <h3 className="font-bold mt-2">Módulo de analógico substituível</h3>
          <p>Outro diferencial importante é o <strong>módulo do controle analógico substituível</strong>.</p>
          <p>Caso o módulo apresente desgaste ao longo do tempo, ele pode ser substituído separadamente, prolongando a vida útil do controle. <strong>O módulo de substituição é vendido separadamente.</strong></p>

          <h3 className="font-bold mt-2">Estojo de transporte incluso</h3>
          <p>O DualSense Edge acompanha um <strong>estojo próprio</strong>, desenvolvido para armazenar o controle e seus acessórios de maneira organizada.</p>
          <p>O estojo também permite carregar o controle por USB enquanto ele está armazenado, mantendo tudo protegido e pronto para a próxima sessão de jogo.</p>

          <h3 className="font-bold mt-2">O que vem na caixa</h3>
          <p>O produto acompanha:</p>
          <ul className="list-disc pl-5">
            <li>1 × Controle sem fio DualSense Edge</li>
            <li>1 × Cabo USB trançado</li>
            <li>2 × Capas de analógico padrão</li>
            <li>2 × Capas de analógico de domo alto</li>
            <li>2 × Capas de analógico de domo baixo</li>
            <li>2 × Botões traseiros de meio domo</li>
            <li>2 × Botões traseiros de alavanca</li>
            <li>1 × Encaixe de conector</li>
            <li>1 × Estojo de transporte</li>
          </ul>

          <h3 className="font-bold mt-2">Especificações</h3>
          <p>Sony DualSense Edge, modelo CFI-ZCP1WY, compatível com PlayStation 5. Conexão sem fio ou USB, cor Midnight Black, perfis personalizados, botões reconfiguráveis e traseiros, gatilhos adaptáveis, resposta tátil e analógicos substituíveis (módulo vendido separadamente). Estojo e cabo USB trançado inclusos.</p>
          <p>A página da KaBuM! informa 1 ano de garantia para este modelo: 3 meses de garantia legal e 9 meses de garantia contratual do fabricante.</p>

          <h3 className="font-bold mt-2">Resumindo</h3>
          <p>O <strong>DualSense Edge Midnight Black</strong> é uma versão mais avançada e personalizável do controle tradicional do PS5. Seu grande diferencial está na possibilidade de <strong>adaptar o controle ao jogador</strong>, com perfis personalizados, botões traseiros, ajustes de sensibilidade, regulagem dos gatilhos, diferentes capas para os analógicos e módulo de analógico substituível.</p>
          <p>É uma opção especialmente voltada para quem busca <strong>precisão, personalização e desempenho em jogos competitivos</strong>, sem abrir mão dos recursos imersivos característicos do DualSense.</p>

        </div>
      )}

      <div className="mt-4 space-y-3">
        {descriptionImages.slice(0, 3).map((img) => (
          <img key={img.src} src={img.src} alt={img.alt} className="w-full rounded" loading="lazy" />
        ))}
        {imagesExpanded ? (
          <>
            {descriptionImages.slice(3).map((img) => (
              <img key={img.src} src={img.src} alt={img.alt} className="w-full rounded" loading="lazy" />
            ))}
          </>
        ) : (
          <div className="relative aspect-[931/412] overflow-hidden">
            <img src={descriptionImages[3].src} alt={descriptionImages[3].alt} className="w-full h-auto" loading="lazy" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-card" aria-hidden="true" />
          </div>
        )}
      </div>
      <Button
        type="button"
        variant="link"
        onClick={() => setImagesExpanded((current) => !current)}
        aria-expanded={imagesExpanded}
        className="flex h-auto items-center gap-2 mt-4 p-0 text-[14px] text-ml-blue font-semibold hover:underline"
      >
        {imagesExpanded ? "Ver menos" : "Ver mais"}
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {imagesExpanded ? <polyline points="6 15 12 9 18 15" /> : <polyline points="6 9 12 15 18 9" />}
        </svg>
      </Button>
    </div>
  )
}
