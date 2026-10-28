import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AccountListings from "@/components/AccountListings";
import { ACCOUNT_GAMES } from "@/data/accounts";

type Props = { params: Promise<{ game: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return ACCOUNT_GAMES.map(({ slug }) => ({ game: slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game: slug } = await params;
  const game = ACCOUNT_GAMES.find((item) => item.slug === slug);
  return { title: game ? `Akun ${game.name} Demo | TopUp` : "Game tidak ditemukan | TopUp" };
}
export default async function AccountGamePage({ params }: Props) {
  const { game: slug } = await params;
  const game = ACCOUNT_GAMES.find((item) => item.slug === slug);
  if (!game) notFound();
  return <AccountListings game={game} />;
}
