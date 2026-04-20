import type { Metadata } from 'next';
import { Footer } from '../_components/footer';
import { Nav } from '../_components/nav';
import { ThemeLab } from '../_components/theme-lab';

export const metadata: Metadata = {
  title: 'Theme Lab',
  description:
    'Interactive theme switcher for Absolute UI. Pick a personality — Aurora, Obsidian, Frost, Sunset — and watch live surfaces, glass recipes, and motion repaint in real time. Copy the tokens when you pick one.',
};

export default function ThemesPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-6 pb-16">
        <ThemeLab />
      </main>
      <Footer />
    </>
  );
}
