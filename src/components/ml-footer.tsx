export function MLFooter() {
  const toolCategories = [
    {
      title: "Impressão 3D",
      links: ["Impressoras 3D", "Filamentos PLA", "Filamentos TPU", "Bicos e extrusores", "Plataformas magnéticas", "Peças de reposição"],
    },
    {
      title: "Tecnologia",
      links: ["Ferramentas", "Cartões de memória", "Cabos e fontes", "Eletrônicos", "Acessórios para maker"],
    },
    {
      title: "Marcas",
      links: ["K7", "EasyThreed", "Creality", "Elegoo"],
    },
    {
      title: "Tendências",
      links: ["Modelos para imprimir", "Kits para iniciantes", "Novidades", "Promoções"],
    },
  ]


  return (
    <footer className="bg-white mt-8 border-t border-[#e0e0e0]">
      {/* Bottom footer */}
      <div className="bg-[#fafafa] border-t border-[#e0e0e0]">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-[11px] md:text-[12px] text-[#999] mb-3">
            <a href="#" className="hover:text-[#333]">Trabalhe conosco</a>
            <span>|</span>
            <a href="#" className="hover:text-[#333]">Termos e condições</a>
            <span>|</span>
            <a href="#" className="hover:text-[#333]">Privacidade</a>
            <span>|</span>
            <a href="#" className="hover:text-[#333]">Como cuidamos da sua privacidade</a>
            <span>|</span>
            <a href="#" className="hover:text-[#333]">Acessibilidade</a>
            <span>|</span>
            <a href="#" className="hover:text-[#333]">Informação ao consumidor</a>
            <span>|</span>
            <a href="#" className="hover:text-[#333]">Contato</a>
          </div>
          <p className="text-[11px] text-[#999] text-center">
            {'Copyright © 1999-2025 Ebazar.com.br LTDA. Rua Iguaçu, 175, 3° andar, Itaim Bibi, São Paulo. CNPJ: 03.007.331/0001-41. Inscrição Estadual: 685.963.694.118'}
          </p>
          <p className="text-[11px] text-[#999] text-center mt-1">
            Protegido por reCAPTCHA
          </p>
        </div>
      </div>
    </footer>
  )
}
