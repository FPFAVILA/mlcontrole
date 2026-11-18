export function MercadoPagoHeader() {
  return (
    <div>
      {/* Mercado Pago logo */}
      <div className="bg-[#f5f5f5] py-4 md:py-6 flex items-center justify-center">
        <img
          src="/images/mercado-pago-logo.png"
          alt="Mercado Pago"
          className="h-[50px] md:h-[70px] w-auto object-contain"
        />
      </div>

      {/* Guarantee bar */}
      <div className="bg-[#009ee3] text-white text-center py-2 px-3 text-[11px] md:text-[13px]">
        {'Esta compra possui garantia. O '}
        <span className="font-bold">Mercado Pago</span>
        {' garante a entrega do pedido ou '}
        <a href="#" className="underline font-bold">reembolso total do valor pago</a>.
      </div>

      {/* Promo banner */}
      <div className="w-full">
        <img
          src="/images/banner-mes-consumidor.png"
          alt="Ultimos Dias - 3.3 Mes do Consumidor"
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  )
}
