import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailClient id={id} />;
}

export async function generateStaticParams() {
  // Pre-generate static HTML files for product IDs 1 to 20 during compile
  return Array.from({ length: 20 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}
