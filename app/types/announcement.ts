export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
}

export const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Welcome to PurpleCon 2024!",
    content:
      "We are excited to welcome everyone to PurpleCon 2024! Get ready for an amazing experience filled with learning, networking, and fun activities.",
    author: {
      name: "Event Organizer",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    createdAt: "2024-03-15T10:00:00Z",
    likes: 45,
    comments: 12,
  },
  {
    id: "2",
    title: "Workshop Schedule Update",
    content:
      "The workshop on Advanced React Patterns has been moved to Room B. Please check your schedules for the updated location.",
    author: {
      name: "Workshop Coordinator",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    createdAt: "2024-03-14T15:30:00Z",
    likes: 32,
    comments: 8,
  },
  {
    id: "3",
    title: "Networking Event Tonight",
    content:
      "Join us tonight at 7 PM in the main hall for our networking event. Free drinks and snacks will be provided!",
    author: {
      name: "Social Events Team",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    createdAt: "2024-03-14T09:00:00Z",
    likes: 78,
    comments: 15,
  },
];
