import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

interface TOCItem {
  id: string;
  title: string;
  level: number;
  children?: TOCItem[];
  isCollapsed?: boolean;
}

interface CollapsibleItem {
  id: string;
  title: string;
  children: TOCItem[];
  isCollapsed: boolean;
}

const MAIN_SECTIONS = [
  "Oracle API Documentation",
  " TOMI SuperApp – Translation API",
];

// Define the hierarchical structure for both APIs
const ORACLE_API_STRUCTURE: CollapsibleItem[] = [
  {
    id: "overview",
    title: "Overview",
    children: [],
    isCollapsed: false,
  },
  {
    id: "base-url",
    title: "Base URL",
    children: [],
    isCollapsed: false,
  },
  {
    id: "endpoints",
    title: "Endpoints",
    children: [
      { id: "resolve-question", title: "Resolve Question", level: 3 },
      { id: "request-body", title: "Request Body", level: 4 },
      { id: "example-request", title: "Example Request", level: 4 },
      { id: "response", title: "Response", level: 4 },
      { id: "response-parameters", title: "Response Parameters", level: 4 },
    ],
    isCollapsed: false,
  },
  {
    id: "retry-mechanism",
    title: "Retry Mechanism",
    children: [],
    isCollapsed: false,
  },
  {
    id: "file-naming",
    title: "File Naming Convention",
    children: [],
    isCollapsed: false,
  },
  {
    id: "sdk-examples",
    title: "SDK Examples",
    children: [
      { id: "javascript-example", title: "JavaScript/Node.js", level: 3 },
      { id: "python-example", title: "Python", level: 3 },
    ],
    isCollapsed: false,
  },
  {
    id: "postman-collection",
    title: "Postman Collection",
    children: [],
    isCollapsed: false,
  },
];

const TOMI_API_STRUCTURE: CollapsibleItem[] = [
  {
    id: "tomi-translation-api",
    title: "Overview",
    children: [],
    isCollapsed: false,
  },
  {
    id: "tomi-request-body",
    title: "Request Body",
    children: [],
    isCollapsed: false,
  },
  {
    id: "tomi-example-request",
    title: "Example Request",
    children: [],
    isCollapsed: false,
  },
  {
    id: "tomi-response",
    title: "Response",
    children: [],
    isCollapsed: false,
  },
  {
    id: "tomi-response-parameters",
    title: "Response Parameters",
    children: [],
    isCollapsed: false,
  },
  {
    id: "error-responses",
    title: "Error Responses",
    children: [],
    isCollapsed: false,
  },
  {
    id: "tomi-sdk-examples",
    title: "SDK Examples",
    children: [],
    isCollapsed: false,
  },
];

export const TableOfContents = () => {
  const [activeId, setActiveId] = useState<string>("");
  const [oracleCollapsed, setOracleCollapsed] = useState<{
    [key: string]: boolean;
  }>({});
  const [tomiCollapsed, setTomiCollapsed] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const findHeadings = () => {
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
      return items;
    };

    let items = findHeadings();

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

      // Find the heading that's closest to the current scroll position
      let closestHeading = null;
      let minDistance = Infinity;

      items.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          const distance = Math.abs(element.offsetTop - scrollPosition);
          if (distance < minDistance) {
            minDistance = distance;
            closestHeading = item;
          }
        }
      });

      if (closestHeading && closestHeading.id !== activeId) {
        console.log("Setting active heading to:", closestHeading.id);
        setActiveId(closestHeading.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeId]);

  const scrollToSection = (id: string) => {
    console.log("Scrolling to section:", id);
    const element = document.getElementById(id);

    if (element) {
      console.log("Element found, scrolling...");

      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;

      console.log(
        "Element position:",
        element.offsetTop,
        "Target position:",
        elementPosition
      );

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });

      setActiveId(id);
    } else {
      console.log("Element not found for ID:", id);
    }
  };

  const toggleCollapse = (apiType: "oracle" | "tomi", itemId: string) => {
    if (apiType === "oracle") {
      setOracleCollapsed((prev) => ({
        ...prev,
        [itemId]: !prev[itemId],
      }));
    } else {
      setTomiCollapsed((prev) => ({
        ...prev,
        [itemId]: !prev[itemId],
      }));
    }
  };

  const renderCollapsibleItem = (
    item: CollapsibleItem,
    apiType: "oracle" | "tomi",
    isMainSection: boolean = false
  ) => {
    const isCollapsed =
      apiType === "oracle" ? oracleCollapsed[item.id] : tomiCollapsed[item.id];

    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeId === item.id;

    // Check if any child is active to prevent parent highlighting
    const hasActiveChild =
      hasChildren && item.children.some((child) => activeId === child.id);

    return (
      <div key={item.id} className="space-y-1">
        <div className="flex items-center">
          {hasChildren && (
            <button
              onClick={() => toggleCollapse(apiType, item.id)}
              className={`p-1 transition-transform duration-200 ${
                isCollapsed ? "" : "rotate-90"
              }`}
            >
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
          <button
            onClick={() => scrollToSection(item.id)}
            className={`flex-1 text-left text-sm transition-colors hover:text-primary ${
              isMainSection
                ? "text-white bg-gradient-to-r from-primary to-blue-500 font-bold rounded px-2 py-1 my-1 shadow"
                : isActive && !hasActiveChild
                ? "text-primary font-medium border-l-2 border-primary pl-3"
                : "text-muted-foreground pl-3"
            }`}
          >
            {item.title}
          </button>
        </div>

        {hasChildren && !isCollapsed && (
          <div className="ml-4 space-y-1">
            {item.children.map((child) => (
              <button
                key={child.id}
                onClick={() => scrollToSection(child.id)}
                className={`block w-full text-left text-sm transition-colors hover:text-primary ${
                  activeId === child.id
                    ? "text-primary font-medium border-l-2 border-primary pl-3"
                    : "text-muted-foreground pl-3"
                }`}
                style={{ marginLeft: `${(child.level - 3) * 12}px` }}
              >
                {child.title}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="sticky top-8">
      <div className="text-sm font-semibold mb-4 text-foreground">
        On this page
      </div>
      <nav className="space-y-2">
        {/* Oracle API Documentation */}
        <div className="space-y-1">
          <div className="text-sm font-semibold text-primary mb-2">
            Oracle API Documentation
          </div>
          {ORACLE_API_STRUCTURE.map((item) =>
            renderCollapsibleItem(item, "oracle")
          )}
        </div>

        {/* TOMI SuperApp Translation API */}
        <div className="space-y-1 mt-6">
          <div className="text-sm font-semibold text-primary mb-2">
            TOMI SuperApp – Translation API
          </div>
          {TOMI_API_STRUCTURE.map((item) =>
            renderCollapsibleItem(item, "tomi")
          )}
        </div>
      </nav>
    </div>
  );
};
