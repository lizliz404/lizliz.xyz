import SkillLandingCraft from "@/components/SkillLandingCraft";

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SkillLandingCraft />
      {children}
    </>
  );
}
