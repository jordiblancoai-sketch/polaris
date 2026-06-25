import { TawkChat } from "@/components/TawkChat";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <TawkChat />
    </>
  );
}
