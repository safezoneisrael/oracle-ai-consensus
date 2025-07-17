import { useState, useEffect } from "react";

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

const MAIN_SECTIONS = [
  "Oracle API Documentation",
  "🧠 TOMI SuperApp – Translation API",
];

export const TableOfContents = () => {
  const [activeId, setActiveId] = useState<string>("");
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);

  useEffect(() => {
    const findHeadings = () => {
      // Simple approach: find all headings with IDs
      const headings = document.querySelectorAll(
        "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"
      );

      console.log("Raw headings found:", headings.length);

      const items: TOCItem[] = Array.from(headings)
        .map((heading) => ({
          id: heading.id,
          title: heading.textContent?.trim() || "",
          level: parseInt(heading.tagName.charAt(1)),
        }))
        .filter((item) => item.title && item.id);

      console.log("Processed headings:", items);
      setTocItems(items);
      return items;
    };

    // Try to find headings immediately
    let items = findHeadings();

    // If no headings found, try again after a short delay
    if (items.length === 0) {
      console.log("No headings found initially, retrying...");
      const timer = setTimeout(() => {
        items = findHeadings();
      }, 100);
      return () => clearTimeout(timer);
    }

    const handleScroll = () => {
      if (items.length === 0) return;

      const scrollPosition = window.scrollY + 100;

      // Find the current section
      let currentHeading = null;

      for (let i = items.length - 1; i >= 0; i--) {
        const element = document.getElementById(items[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          currentHeading = items[i];
          break;
        }
      }

      if (currentHeading && currentHeading.id !== activeId) {
        console.log("Setting active heading to:", currentHeading.id);
        setActiveId(currentHeading.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeId]);

  const scrollToSection = (id: string) => {
    console.log("Scrolling to section:", id);
    const element = document.getElementById(id);

    if (element) {
      console.log("Element found, scrolling...");

      // Calculate the target position
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;

      console.log(
        "Element position:",
        element.offsetTop,
        "Target position:",
        elementPosition
      );

      // Scroll to the element
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });

      // Update active state immediately
      setActiveId(id);
    } else {
      console.log("Element not found for ID:", id);
      console.log(
        "Available elements:",
        tocItems.map((item) => item.id)
      );
    }
  };

  return (
    <div className="sticky top-8">
      <div className="text-sm font-semibold mb-4 text-foreground">
        On this page
      </div>
      <nav className="space-y-1">
        {tocItems.length === 0 ? (
          <div className="text-sm text-muted-foreground">No sections found</div>
        ) : (
          tocItems.map((item) => {
            const isMain = MAIN_SECTIONS.includes(item.title);
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left text-sm transition-colors hover:text-primary ${
                  isMain
                    ? "text-white bg-gradient-to-r from-primary to-blue-500 font-bold rounded px-2 py-1 my-1 shadow"
                    : activeId === item.id
                    ? "text-primary font-medium border-l-2 border-primary pl-3"
                    : "text-muted-foreground pl-3"
                }`}
                style={{ marginLeft: `${(item.level - 1) * 12}px` }}
              >
                {item.title}
              </button>
            );
          })
        )}
      </nav>
    </div>
  );
};
