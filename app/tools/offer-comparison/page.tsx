import { redirect } from "next/navigation";

export { metadata } from "./metadata";

export default function OfferComparisonPage() {
  redirect("/compare");
}
