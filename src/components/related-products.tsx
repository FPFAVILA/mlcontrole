const relatedProducts = [
  {
    title: "Impressora 3D Compacta K7 12V Bivolt Plataforma Magnética...",
    price: "R$ 97,00",
    priceOld: "R$ 699,99",
    installments: "12x R$ 8,08",
    freeShipping: true,
    img: "/images/product-1.jpg",
  },
  {
    title: "Impressora 3D Compacta K7 - Plataforma magnética removível...",
    price: "R$ 97,00",
    priceOld: "R$ 699,99",
    installments: "12x R$ 8,08",
    freeShipping: true,
    img: "/images/product-3.jpg",
  },
  {
    title: "Impressora 3D Compacta K7 - Área de criação 10x10x10 cm...",
    price: "R$ 97,00",
    priceOld: "R$ 699,99",
    installments: "12x R$ 8,08",
    freeShipping: true,
    img: "/images/product-4.jpg",
  },
  {
    title: "Impressora 3D Compacta K7 - Bico de 0,4 mm...",
    price: "R$ 97,00",
    priceOld: "R$ 699,99",
    installments: "12x R$ 8,08",
    freeShipping: true,
    img: "/images/product-5.jpg",
  },
  {
    title: "Impressora 3D Compacta K7 - Itens inclusos...",
    price: "R$ 97,00",
    priceOld: "R$ 699,99",
    installments: "12x R$ 8,08",
    freeShipping: true,
    img: "/images/product-7.jpg",
  },
]


export function RelatedProducts({ title }: { title: string }) {
  return (
    <div className="mt-8 bg-white rounded-lg p-6">
      <h2 className="text-[20px] font-semibold text-[#333] mb-4">{title}</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {relatedProducts.map((product, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[180px] bg-white rounded-lg border border-[#e0e0e0] overflow-hidden cursor-pointer hover:shadow-md"
          >
            <div className="w-full h-[140px] bg-[#f5f5f5] flex items-center justify-center overflow-hidden">
              <img loading="lazy" decoding="async" src={product.img} alt={product.title} className="w-full h-full object-contain p-2" />
            </div>
            <div className="p-3">
              <p className="text-[12px] text-[#333] line-clamp-2 mb-2 leading-tight">{product.title}</p>
              {product.priceOld && (
                <p className="text-[11px] text-[#999] line-through">{product.priceOld}</p>
              )}
              <p className="text-[16px] font-semibold text-[#333]">{product.price}</p>
              <p className="text-[11px] text-[#00a650]">{product.installments}</p>
              {product.freeShipping && (
                <p className="text-[11px] text-[#00a650] font-medium mt-1">Frete grátis</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
