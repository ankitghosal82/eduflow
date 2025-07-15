export type CourseItem = {
  id: string
  name: string
  type: "youtube" | "article" | "github"
  url: string
  points: number
}

export type Topic = {
  id: string
  name: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  estimatedTime: string
  image?: string
  headerBg: string
  headerText: string
  items: CourseItem[]
}

export const topics: Topic[] = [
  {
    id: "react-basics",
    name: "React Basics",
    description: "Learn the fundamental concepts of React.js, including components, props, state, and hooks.",
    difficulty: "easy",
    estimatedTime: "8 hours",
    image: "/placeholder-logo.png",
    headerBg: "bg-blue-900",
    headerText: "text-blue-200",
    items: [
      { id: "react-intro", name: "Introduction to React", type: "article", url: "https://react.dev/learn", points: 10 },
      {
        id: "react-components",
        name: "Understanding Components",
        type: "youtube",
        url: "https://www.youtube.com/watch?v=SqcY0GlETPk",
        points: 15,
      },
      {
        id: "react-props-state",
        name: "Props and State in React",
        type: "article",
        url: "https://react.dev/learn/passing-props-to-a-component",
        points: 15,
      },
      {
        id: "react-hooks",
        name: "Introduction to Hooks (useState, useEffect)",
        type: "youtube",
        url: "https://www.youtube.com/watch?v=dpw9EHDh2bM",
        points: 20,
      },
    ],
  },
  {
    id: "nextjs-fundamentals",
    name: "Next.js Fundamentals",
    description:
      "Dive into Next.js, covering routing, data fetching, and server components for modern web development.",
    difficulty: "medium",
    estimatedTime: "12 hours",
    image: "/placeholder-logo.png",
    headerBg: "bg-gray-900",
    headerText: "text-gray-200",
    items: [
      {
        id: "nextjs-routing",
        name: "App Router Basics",
        type: "article",
        url: "https://nextjs.org/docs/app",
        points: 20,
      },
      {
        id: "nextjs-data-fetching",
        name: "Data Fetching in Next.js",
        type: "youtube",
        url: "https://www.youtube.com/watch?v=Q_0g_j_tQ0Y",
        points: 25,
      },
      {
        id: "nextjs-server-components",
        name: "Server Components Explained",
        type: "article",
        url: "https://nextjs.org/docs/app/building-your-application/rendering/server-components",
        points: 30,
      },
      {
        id: "nextjs-deployment",
        name: "Deploying Next.js to Vercel",
        type: "github",
        url: "https://vercel.com/docs/deployments/overview",
        points: 20,
      },
    ],
  },
  {
    id: "typescript-deep-dive",
    name: "TypeScript Deep Dive",
    description: "Master TypeScript's advanced features, including generics, interfaces, and utility types.",
    difficulty: "hard",
    estimatedTime: "10 hours",
    image: "/placeholder-logo.png",
    headerBg: "bg-blue-700",
    headerText: "text-blue-100",
    items: [
      {
        id: "ts-generics",
        name: "Understanding Generics",
        type: "article",
        url: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
        points: 25,
      },
      {
        id: "ts-interfaces-types",
        name: "Interfaces vs. Types",
        type: "youtube",
        url: "https://www.youtube.com/watch?v=l2AD_y-x-2c",
        points: 20,
      },
      {
        id: "ts-utility-types",
        name: "Exploring Utility Types",
        type: "article",
        url: "https://www.typescriptlang.org/docs/handbook/utility-types.html",
        points: 30,
      },
      {
        id: "ts-advanced-patterns",
        name: "Advanced TypeScript Patterns",
        type: "github",
        url: "https://github.com/basarat/typescript-book/blob/master/docs/tips/type-guards.md",
        points: 35,
      },
    ],
  },
  {
    id: "css-fundamentals",
    name: "CSS Fundamentals",
    description: "Learn the core concepts of CSS, including layout, styling, and responsive design.",
    difficulty: "easy",
    estimatedTime: "6 hours",
    image: "/placeholder-logo.png",
    headerBg: "bg-purple-900",
    headerText: "text-purple-200",
    items: [
      {
        id: "css-selectors",
        name: "CSS Selectors and Specificity",
        type: "article",
        url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity",
        points: 10,
      },
      {
        id: "css-box-model",
        name: "The CSS Box Model",
        type: "youtube",
        url: "https://www.youtube.com/watch?v=Yf-g_j-j-0Q",
        points: 15,
      },
      {
        id: "css-flexbox",
        name: "Flexbox Layout",
        type: "article",
        url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
        points: 20,
      },
      {
        id: "css-grid",
        name: "CSS Grid Layout",
        type: "youtube",
        url: "https://www.youtube.com/watch?v=RhYQ_g_2DVE",
        points: 20,
      },
    ],
  },
  {
    id: "javascript-es6",
    name: "JavaScript ES6+",
    description:
      "Explore modern JavaScript features introduced in ES6 and beyond, including arrow functions, destructuring, and async/await.",
    difficulty: "medium",
    estimatedTime: "9 hours",
    image: "/placeholder-logo.png",
    headerBg: "bg-yellow-800",
    headerText: "text-yellow-200",
    items: [
      {
        id: "js-arrow-functions",
        name: "Arrow Functions",
        type: "article",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions",
        points: 15,
      },
      {
        id: "js-destructuring",
        name: "Destructuring Assignment",
        type: "youtube",
        url: "https://www.youtube.com/watch?v=NIq3DO_X_28",
        points: 20,
      },
      {
        id: "js-async-await",
        name: "Async/Await",
        type: "article",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function",
        points: 25,
      },
      {
        id: "js-modules",
        name: "ES Modules",
        type: "github",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules",
        points: 20,
      },
    ],
  },
  {
    id: "data-structures-algorithms",
    name: "Data Structures & Algorithms",
    description:
      "Understand common data structures and algorithms, and learn how to apply them to solve programming problems.",
    difficulty: "hard",
    estimatedTime: "15 hours",
    image: "/placeholder-logo.png",
    headerBg: "bg-red-900",
    headerText: "text-red-200",
    items: [
      {
        id: "dsa-arrays-linkedlists",
        name: "Arrays and Linked Lists",
        type: "article",
        url: "https://www.geeksforgeeks.org/data-structures/",
        points: 30,
      },
      {
        id: "dsa-trees-graphs",
        name: "Trees and Graphs",
        type: "youtube",
        url: "https://www.youtube.com/watch?v=oDqjPvD54Ss",
        points: 35,
      },
      {
        id: "dsa-sorting",
        name: "Sorting Algorithms",
        type: "article",
        url: "https://www.geeksforgeeks.org/sorting-algorithms/",
        points: 25,
      },
      {
        id: "dsa-searching",
        name: "Searching Algorithms",
        type: "github",
        url: "https://github.com/trekhleb/javascript-algorithms/tree/master/src/algorithms/searching",
        points: 25,
      },
    ],
  },
]
