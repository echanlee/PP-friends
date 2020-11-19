import "./Questionnaire.css";

const qBank = [
  {
    question: "What is the most important thing about a friendship to you?",
    answers: ["Have somebody to confide in", "Have somebody to have fun with"],
    questionId: "1",
  },
  {
    question: "Would you rather...",
    answers: [
      "Have a friend who enjoys doing the same things as you",
      "Have a friend who feels the same way about life as you do",
    ],
    questionId: "2",
  },
  {
    question: "Which statement below do you relate the most?",
    answers: [
      "I like to be close to people",
      "I like to keep my distance from people",
    ],
    questionId: "3",
  },
  {
    question: "When you talk with friends on the phone, it is usually to?",
    answers: ["Make arrangements or plans", "Have a conversation or chat"],
    questionId: "4",
  },
  {
    question: "Which statement below do you relate the most?",
    answers: [
      "I like to plan where I am going and who I am going with",
      "I like to be spontaneous and just let fate decide",
    ],
    questionId: "5",
  },
  {
    question:
      "You are going to the movies, which genre would you likely choose?",
    answers: ["Action", "Drama"],
    questionId: "6",
  },
  {
    question:
      "If you are meeting a friend, what activity would you prefer doing?",
    answers: ["Shopping", "Playing at the Arcade"],
    questionId: "7",
  },
  {
    question:
      "If you moved to a new city, which would you rather put more effort into?",
    answers: ["Staying in touch with old friends", "Making new friends"],
    questionId: "8",
  },
  {
    question: "As a friend, you are someone that?",
    answers: ["Supports others", "Is fun to be with"],
    questionId: "9",
  },
  {
    question: "What do you do when your friend has a problem",
    answers: ["Discuss their feelings", "Come up with practical solutions"],
    questionId: "10",
  },
  {
    question: "If your friend was having personal problems, what do you do?",
    answers: [
      "Wait for them to contact you",
      "Contact them to discuss the problem",
    ],
    questionId: "11",
  },
  {
    question: "What do you do when you have a personal problem?",
    answers: ["I work it out on my own", "I share it with a friend"],
    questionId: "12",
  },
  {
    question:
      "When talking with friends, which of the topics below are you more interested to talk about?",
    answers: ["Political and current affairs", "Hobbies and interests"],
    questionId: "13",
  },
  {
    question:
      "When talking with friends, which of the topics below are you more interested to talk about?",
    answers: ["Family and friends", "Work or school"],
    questionId: "14",
  },
  {
    question:
      "When talking to someone you just met, which of the topics below are you more interested to talk about?",
    answers: ["Political and current affairs", "Hobbies and interests"],
    questionId: "15",
  },
  {
    question:
      "When talking to someone you just met, which of the topics below are you more interested to talk about?",
    answers: ["Family and friends", "Work or school"],
    questionId: "16",
  },
];

export default () => Promise.resolve(qBank);
