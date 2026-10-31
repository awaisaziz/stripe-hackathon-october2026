import { notFound } from "next/navigation";
import { getDesignBySlug } from "@/lib/store";
import { ProductPurchase } from "@/components/ProductPurchase";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const design = await getDesignBySlug(slug);
  if (!design) return { title: "Design Not Found — PromptWear" };

  return {
    title: `${design.title} — PromptWear Custom Apparel`,
    description: design.prompt,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const design = await getDesignBySlug(slug);

  if (!design) {
    notFound();
  }

  return <ProductPurchase design={design} />;
}
