import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

export const TableOfContents = () => {
  const [activeId, setActiveId] = useState<string>('');
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);

  useEffect(() => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const items: TOCItem[] = Array.from(headings).map((heading) => ({
      id: heading.id,
      title: heading.textContent || '',
      level: parseInt(heading.tagName.charAt(1))
    }));
    setTocItems(items);

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      const currentHeading = items
        .slice()
        .reverse()
        .find((item) => {
          const element = document.getElementById(item.id);
          return element && element.offsetTop <= scrollPosition;
        });
      
      if (currentHeading) {
        setActiveId(currentHeading.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-8">
      <div className="text-sm font-semibold mb-4 text-foreground">On this page</div>
      <nav className="space-y-1">
        {tocItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`block w-full text-left text-sm transition-colors hover:text-primary ${
              activeId === item.id 
                ? 'text-primary font-medium border-l-2 border-primary pl-3' 
                : 'text-muted-foreground pl-3'
            }`}
            style={{ marginLeft: `${(item.level - 1) * 12}px` }}
          >
            {item.title}
          </button>
        ))}
      </nav>
    </div>
  );
};