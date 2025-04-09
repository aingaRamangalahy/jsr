import type { Resource } from '@/types/resource'

export const resources: Resource[] = [
  {
    id: 1,
    title: 'JavaScript.info',
    description:
      'Modern JavaScript Tutorial: simple, but detailed explanations with examples and tasks, including closures, document and events, object-oriented programming and more. This resource is perfect for beginners who want to build a strong foundation in JavaScript and understand the language in depth.',
    url: 'https://javascript.info/',
    type: 'website',
    image:
      'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    skillLevel: 'beginner',
    tags: ['fundamentals', 'tutorial', 'comprehensive'],
    rating: 4.9,
    votes: 1243,
    dateAdded: '2023-01-15',
  },
  {
    id: 2,
    title: 'Eloquent JavaScript',
    description:
      'A book about JavaScript, programming, and the wonders of the digital. A comprehensive guide that imparts programming wisdom. It is an excellent resource for intermediate learners who want to enhance their understanding of JavaScript concepts and programming paradigms.',
    url: 'https://eloquentjavascript.net/',
    type: 'book',
    image:
      'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    skillLevel: 'intermediate',
    tags: ['book', 'fundamentals', 'programming'],
    rating: 4.8,
    votes: 982,
    dateAdded: '2023-02-20',
  },
  {
    id: 3,
    title: 'Fireship',
    description:
      'High-intensity ⚡, bite-sized 🔥 coding tutorials. Subscribe for videos about modern JavaScript, Flutter, Firebase, and more. Fireship is ideal for developers who prefer quick, engaging, and practical tutorials to learn new technologies and concepts.',
    url: 'https://www.youtube.com/c/Fireship',
    type: 'youtube',
    image:
      'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    skillLevel: 'intermediate',
    tags: ['youtube', 'tutorials', 'quick-tips'],
    rating: 4.9,
    votes: 1567,
    dateAdded: '2023-03-05',
  },
  {
    id: 4,
    title: 'JavaScript30',
    description:
      '30 Day Vanilla JS Challenge. Build 30 things in 30 days with 30 tutorials. No frameworks, no compilers, no libraries, no boilerplate. This course is a hands-on approach to learning JavaScript by building real-world projects, making it perfect for beginners.',
    url: 'https://javascript30.com/',
    type: 'course',
    image:
      'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    skillLevel: 'beginner',
    tags: ['challenge', 'practice', 'projects'],
    rating: 4.7,
    votes: 876,
    dateAdded: '2023-01-30',
  },
  {
    id: 5,
    title: 'Dan Abramov',
    description:
      'Co-author of Redux and Create React App. Working on React at Meta. Tweets about JavaScript, React, and web development. Dan Abramov shares valuable insights and opinions on modern web development practices, making him a must-follow for developers.',
    url: 'https://twitter.com/dan_abramov',
    type: 'twitter',
    image:
      'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    skillLevel: 'intermediate',
    tags: ['react', 'redux', 'opinion-leader'],
    rating: 4.8,
    votes: 723,
    dateAdded: '2023-02-10',
  },
  {
    id: 6,
    title: "You Don't Know JS",
    description:
      "A book series on JavaScript. @YDKJS on twitter. It's a deep dive into the core mechanisms of the JavaScript language. This series is highly recommended for advanced learners who want to master JavaScript and understand its inner workings.",
    url: 'https://github.com/getify/You-Dont-Know-JS',
    type: 'book',
    image:
      'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    skillLevel: 'advanced',
    tags: ['deep-dive', 'language-mechanics', 'book'],
    rating: 4.9,
    votes: 1342,
    dateAdded: '2023-03-15',
  },
]
