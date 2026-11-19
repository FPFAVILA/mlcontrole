import { createFileRoute } from "@tanstack/react-router";
import { MLHeader } from "@/components/ml-header"
import { ProductGallery } from "@/components/product-gallery"
import { ProductInfo } from "@/components/product-info"
import { ProductSidebar } from "@/components/product-sidebar"
import { ProductHighlights } from "@/components/product-highlights"
import { ProductCharacteristics } from "@/components/product-characteristics"
import { ProductDescription } from "@/components/product-description"
import { QuestionsSection } from "@/components/questions-section"
import { SellerReputation } from "@/components/seller-reputation"
import { ReviewsSection } from "@/components/reviews-section"
import { MLFooter } from "@/components/ml-footer"
import { AppOpenBanner } from "@/components/app-open-banner"

function ProductPage() {
  return (
    <div className="min-h-screen bg-[#eeeeee]">
      <AppOpenBanner />
      <MLHeader />

      <main className="max-w-[1200px] mx-auto px-2 md:px-4 pt-4">

        {/* Main product area */}
        <div className="bg-white rounded-lg p-4 md:p-6 flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Left: Gallery */}
          <div className="w-full lg:w-[450px] flex-shrink-0">
            <ProductGallery />
          </div>

          {/* Center: Product Info */}
          <div className="flex-1 min-w-0">
            <ProductInfo />
          </div>

          {/* Right: Sidebar */}
          <ProductSidebar />
        </div>

        {/* Seller reputation */}
        <SellerReputation />

        {/* Description - detalhes do produto */}
        <ProductDescription />

        {/* Questions */}
        <QuestionsSection />

        {/* Reviews */}
        <ReviewsSection />

        {/* Highlights - what you need to know */}
        <ProductHighlights />

        <ProductCharacteristics />

      </main>

      <MLFooter />
    </div>
  )
}

export const Route = createFileRoute("/produto")({
  head: () => ({
    meta: [
      { title: "Kit Película Traseira iPhone XR Estilo 13 Pro Max" },
      { name: "description", content: "Kit de película traseira autoadesiva para iPhone XR, com design inspirado no iPhone 13 Pro Max e lentes decorativas." },
      { property: "og:title", content: "Kit Película Traseira iPhone XR Estilo 13 Pro Max" },
      { property: "og:description", content: "Transforme a traseira do seu iPhone XR com uma película autoadesiva branca e lentes decorativas." },

      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
    ],
  }),
  component: ProductPage,
});
