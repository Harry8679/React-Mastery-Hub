import type { Project } from "../types";


export const projects: Project[] = [
  {
    id: 1,
    title: "useState - Compteur",
    concepts: ["useState", "Event Handlers", "State Management"],
    difficulty: "Débutant",
    color: "from-blue-500 to-cyan-500",
    icon: "🔢",
    component: "CounterProject"
  },
  {
    id: 2,
    title: "useEffect - Horloge",
    concepts: ["useEffect", "Cleanup", "setInterval"],
    difficulty: "Débutant",
    color: "from-purple-500 to-pink-500",
    icon: "⏰",
    component: "ClockProject"
  },
  {
    id: 3,
    title: "Formulaire Contrôlé",
    concepts: ["Controlled Components", "Form Validation", "onChange"],
    difficulty: "Débutant",
    color: "from-green-500 to-emerald-500",
    icon: "📝",
    component: "FormProject"
  },
  {
    id: 4,
    title: "Liste & Keys",
    concepts: ["map()", "key prop", "Conditional Rendering"],
    difficulty: "Débutant",
    color: "from-orange-500 to-red-500",
    icon: "📋",
    component: "TodoListProject"
  },
  {
    id: 5,
    title: "useContext - Thème",
    concepts: ["useContext", "Context API", "Provider/Consumer"],
    difficulty: "Intermédiaire",
    color: "from-indigo-500 to-purple-500",
    icon: "🎨",
    component: "ThemeContextProject"
  },
  {
    id: 6,
    title: "useReducer - Todo List",
    concepts: ["useReducer", "Complex State", "Actions/Reducers"],
    difficulty: "Intermédiaire",
    color: "from-yellow-500 to-orange-500",
    icon: "✅"
  },
  {
    id: 7,
    title: "Custom Hook - useFetch",
    concepts: ["Custom Hooks", "API Calls", "Loading States"],
    difficulty: "Intermédiaire",
    color: "from-teal-500 to-green-500",
    icon: "🔗"
  },
  {
    id: 8,
    title: "useRef - Focus Input",
    concepts: ["useRef", "DOM Manipulation", "Uncontrolled Components"],
    difficulty: "Intermédiaire",
    color: "from-pink-500 to-rose-500",
    icon: "🎯"
  },
  {
    id: 9,
    title: "useMemo - Optimisation",
    concepts: ["useMemo", "Performance", "Memoization"],
    difficulty: "Avancé",
    color: "from-cyan-500 to-blue-500",
    icon: "⚡"
  },
  {
    id: 10,
    title: "useCallback - Callbacks",
    concepts: ["useCallback", "Reference Equality", "Optimization"],
    difficulty: "Avancé",
    color: "from-violet-500 to-purple-500",
    icon: "🔄"
  },
  {
    id: 11,
    title: "Portals - Modal",
    concepts: ["ReactDOM.createPortal", "Modals", "Overlay"],
    difficulty: "Intermédiaire",
    color: "from-fuchsia-500 to-pink-500",
    icon: "🚪"
  },
  {
    id: 12,
    title: "Error Boundary",
    concepts: ["Error Boundaries", "componentDidCatch", "Error Handling"],
    difficulty: "Avancé",
    color: "from-red-500 to-orange-500",
    icon: "🛡️"
  },
  {
    id: 13,
    title: "Lazy Loading",
    concepts: ["React.lazy", "Suspense", "Code Splitting"],
    difficulty: "Avancé",
    color: "from-blue-500 to-indigo-500",
    icon: "📦"
  },
  {
    id: 14,
    title: "HOC - withAuth",
    concepts: ["Higher-Order Components", "Composition", "Props Proxy"],
    difficulty: "Avancé",
    color: "from-green-500 to-teal-500",
    icon: "🔐"
  },
  {
    id: 15,
    title: "Render Props",
    concepts: ["Render Props Pattern", "Children as Function", "Flexibility"],
    difficulty: "Avancé",
    color: "from-amber-500 to-yellow-500",
    icon: "🎭"
  },
  {
    id: 16,
    title: "Compound Components",
    concepts: ["Compound Pattern", "React.Children", "Flexible API"],
    difficulty: "Avancé",
    color: "from-lime-500 to-green-500",
    icon: "🧩"
  },
  {
    id: 17,
    title: "Drag & Drop",
    concepts: ["onDragStart", "onDrop", "Draggable UI"],
    difficulty: "Intermédiaire",
    color: "from-sky-500 to-cyan-500",
    icon: "🎪"
  },
  {
    id: 18,
    title: "Animations - Framer",
    concepts: ["Framer Motion", "Animations", "Transitions"],
    difficulty: "Intermédiaire",
    color: "from-rose-500 to-pink-500",
    icon: "✨"
  },
  {
    id: 19,
    title: "WebSocket Chat",
    concepts: ["WebSocket", "Real-time", "useEffect Cleanup"],
    difficulty: "Avancé",
    color: "from-emerald-500 to-teal-500",
    icon: "💬"
  },
  {
    id: 20,
    title: "Infinite Scroll",
    concepts: ["Intersection Observer", "Pagination", "Performance"],
    difficulty: "Avancé",
    color: "from-purple-500 to-indigo-500",
    icon: "∞"
  },
  {
    id: 21,
    title: "Debounce Search",
    concepts: ["Debouncing", "useEffect", "Performance"],
    difficulty: "Intermédiaire",
    color: "from-orange-500 to-amber-500",
    icon: "🔍"
  },
  {
    id: 22,
    title: "Dark Mode Toggle",
    concepts: ["Context", "localStorage", "CSS Variables"],
    difficulty: "Intermédiaire",
    color: "from-slate-500 to-gray-500",
    icon: "🌓"
  },
  {
    id: 23,
    title: "Multi-step Form",
    concepts: ["State Management", "Validation", "Navigation"],
    difficulty: "Intermédiaire",
    color: "from-blue-500 to-purple-500",
    icon: "📊"
  },
  {
    id: 24,
    title: "Canvas Drawing",
    concepts: ["useRef", "Canvas API", "Event Handling"],
    difficulty: "Avancé",
    color: "from-red-500 to-pink-500",
    icon: "🎨"
  },
  {
    id: 25,
    title: "Zustand Store",
    concepts: ["State Management", "Zustand", "Global State"],
    difficulty: "Intermédiaire",
    color: "from-teal-500 to-cyan-500",
    icon: "🐻"
  },
  {
    id: 26,
    title: "React Query",
    concepts: ["Data Fetching", "Caching", "React Query"],
    difficulty: "Avancé",
    color: "from-violet-500 to-fuchsia-500",
    icon: "🔮"
  },
  {
    id: 27,
    title: "File Upload",
    concepts: ["File API", "FormData", "Progress Bar"],
    difficulty: "Intermédiaire",
    color: "from-green-500 to-lime-500",
    icon: "📤"
  },
  {
    id: 28,
    title: "Markdown Editor",
    concepts: ["Controlled Input", "Preview", "Parsing"],
    difficulty: "Intermédiaire",
    color: "from-indigo-500 to-blue-500",
    icon: "📝"
  },
  {
    id: 29,
    title: "Virtual Scroll",
    concepts: ["Virtualization", "Performance", "Windowing"],
    difficulty: "Avancé",
    color: "from-yellow-500 to-orange-500",
    icon: "📜"
  },
  {
    id: 30,
    title: "Game - Tic Tac Toe",
    concepts: ["State", "Game Logic", "Winner Detection"],
    difficulty: "Intermédiaire",
    color: "from-pink-500 to-rose-500",
    icon: "🎮"
  },
  {
    id: 31,
    title: "Shopping Cart",
    concepts: ["E-commerce", "Cart Management", "State"],
    difficulty: "Intermédiaire",
    color: "from-green-500 to-emerald-500",
    icon: "🛒",
    component: "ShoppingCartProject"
  },
  {
      id: 32,
      title: "Pagination",
      concepts: ["Pagination", "Data Management", "UX"],
      difficulty: "Intermédiaire",
      color: "from-indigo-500 to-blue-500",
      icon: "📄",
      component: "PaginationProject"
  },
  {
      id: 33,
      title: "Notifications / Toast",
      concepts: ["Toast", "Notifications", "Context API"],
      difficulty: "Intermédiaire",
      color: "from-purple-500 to-pink-500",
      icon: "🔔",
      component: "NotificationsProject"
  },
  {
    id: 34,
    title: "Image Gallery",
    concepts: ["Gallery", "Lightbox", "Filters"],
    difficulty: "Intermédiaire",
    color: "from-gray-500 to-slate-600",
    icon: "🖼️",
    component: "ImageGalleryProject"
  },
  {
    id: 35,
    title: "Data Visualization",
    concepts: ["Charts", "Recharts", "Data Analysis"],
    difficulty: "Intermédiaire",
    color: "from-blue-500 to-indigo-600",
    icon: "📊",
    component: "DataVisualizationProject"
  }
];