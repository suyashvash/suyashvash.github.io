const CommonTools = {
  reactNative: {
    name: "React Native",
    image: "https://picsum.photos/200/300",
    tag: "react-native",
  },
  redux: {
    id: 2,
    name: "Redux",
    image: "https://picsum.photos/200/300",
    tag: "redux",
  },
  firebase: {
    id: 3,
    name: "Firebase",
    image: "https://picsum.photos/200/300",
    tag: "firebase",
  },
  reactQuery: {
    id: 4,
    name: "React Query",
    image: "https://picsum.photos/200/300",
    tag: "react-query",
  },
  expo: {
    id: 5,
    name: "Expo",
    image: "https://picsum.photos/200/300",
    tag: "expo",
  },
  node: {
    id: 6,
    name: "Node",
    image: "https://picsum.photos/200/300",
    tag: "node",
  },
  jira: {
    id: 7,
    name: "Jira",
    image: "https://picsum.photos/200/300",
    tag: "jira",
  },
  androidStudio: {
    id: 8,
    name: "Android Studio",
    image: "https://picsum.photos/200/300",
    tag: "android-studio",
  },
  xCode: {
    id: 9,
    name: "Xcode",
    image: "https://picsum.photos/200/300",
    tag: "xcode",
  },
  git: {
    id: 10,
    name: "Git",
    image: "https://picsum.photos/200/300",
    tag: "git",
  },
  git: {
    id: 10,
    name: "Postman",
    image: "https://picsum.photos/200/300",
    tag: "postman",
  },
};

export const Projects = [
  {
    id: 1,
    title: "Venyou Co.",
    description:
      "Australia's newest socialising App, connecting groups and individuals at events or venues in zero pressure environments",
    logo: "https://media.licdn.com/dms/image/D560BAQFX8IAxWtTxEA/company-logo_200_200/0/1667562262181?e=2147483647&v=beta&t=qEmyKm0bYjVuut7M0MMdRCZN6XCAcyED5LS9lKT-1PE",
    platform: "mobile",
    visit: {
      android: "https://www.google.com",
      ios: "https://www.google.com",
      web: "https://www.google.com",
    },
    type: "Social Media",
    location: "Australia",
    features: [
      "Multi user platform",
      "Real time chats",
      "Maps and GPS integration",
      "REST API",
      "Push notifications",
      "Deep linking",
    ],
    technologies: [
      CommonTools.reactNative,
      CommonTools.redux,
      CommonTools.firebase,
      CommonTools.reactQuery,
      CommonTools.expo,
      CommonTools.node,
      CommonTools.jira,
      CommonTools.androidStudio,
      CommonTools.xCode,
      CommonTools.git,
    ],
    screenshots: [
      {
        id: 1,
        source: "https://picsum.photos/200/300",
        alt: "Venyou Screenshot 1",
      },
      {
        id: 2,
        source: "https://picsum.photos/200/300",
        alt: "Venyou Screenshot 2",
      },
      {
        id: 3,
        source: "https://picsum.photos/200/300",
        alt: "Venyou Screenshot 3",
      },
    ],
    client: {
      name: "Spiro Alisandratos",
      image:
        "https://media.licdn.com/dms/image/C5603AQFvWrXIRiZFNg/profile-displayphoto-shrink_200_200/0/1610254589275?e=1700092800&v=beta&t=Xz_k5dQX0Gsy8xZiaMX5IhP3tbeva1FhDFnkqw8KkoE",
      review:
        "I hired Suyash to build a React Native App that we a currently working on together. I started building the app but with full-time work I found it hard to develop on my own. I spent such a long time looking via freelancer pages and contacting developers directly but I wasn't happy with any of the options. I found Suyash via a recommendation and my search was over. This developer is exceptionally talented. After reviewing the work he's been doing for me I was impressed to read code so easily. His architecture is logical and robust as well. I was able to follow the code straight away as soon as he shared it with me. This developer writes clean code. He's also very responsive, as soon as I message him, within 30 mins he's responded. He will even take the time to respond during non working hours. I hesitate to contact him at times because I know he'll stop what he's doing to answer me. I have worked with a lot or IT engineers throughout my 18 year career and I have to say he's one of the best. I'm quite pedantic about my product and will make suggestions on the app from a client and developer perspective. Suyash will listen and make changes as you wish with no hesitation, he's ability to also respond with even better suggestions makes you want to learn from him. His ability to find a solution so quick for a specific problem that is unique to the project is uncanny. I have a few projects that I want to bring to life and Suyash is the developer I will always use. If you're looking for a React Native or MERN developer you've come to the right page.",
      designation: "CEO / Founder",
      company: "Venyou Co.",
      location: "Australia",
    },
    team: [
      {
        name: "Spiro Alisandratos",
        image:
          "https://media.licdn.com/dms/image/C5603AQFvWrXIRiZFNg/profile-displayphoto-shrink_200_200/0/1610254589275?e=1700092800&v=beta&t=Xz_k5dQX0Gsy8xZiaMX5IhP3tbeva1FhDFnkqw8KkoE",
        designation: "CEO / Founder",
      },
      {
        name: "Kunal Chaudhary",
        image: "https://picsum.photos/200/300",
        designation: "Backend Developer",
      },
      {
        name: "Suyash Vashistha",
        image: "https://picsum.photos/200/300",
        designation: "Mobile Developer",
      },
    ],
    duration: "2 years",
    status: "completed",
  },
  {
    id: 2,
    title: "Playnoot",
    description:
      "Playnoot is a mobile application for sports enthusiasts. Now browse through nearby play facilities, playgrounds, turfs and book slots online with the facility. Buy subscriptions, get coaching of your preferred sport. Travelling or moving from one city to another, book slots with any gym nearby and never skip your workout. Playnoot is powering many sports facilities and Fitness center with CRM tools more user engagement. Signup at our lead form if own any sports center.",
    logo: "https://media.licdn.com/dms/image/D4D0BAQFEsdY9u599EA/company-logo_200_200/0/1690270169428?e=1702512000&v=beta&t=o3qOo2PY_1pVdkR87Pc6Bj1JjVPLbIf4yAOlc_sPTpg",
    platform: "mobile",
    visit: {
      android: "https://www.google.com",
      ios: "https://www.google.com",
      web: "https://www.google.com",
    },
    type: "Sports",
    location: "India",
    features: [
      "Games and Sports Booking App",
      "Booking and Reservation System",
      "Payment Gateway Integration",
      "REST API",
      "Push notifications",
      "Local state management",
    ],
    technologies: [
      CommonTools.reactNative,
      CommonTools.redux,
      CommonTools.firebase,
      CommonTools.reactQuery,
      CommonTools.node,
      CommonTools.jira,
      CommonTools.androidStudio,
      CommonTools.xCode,
      CommonTools.git,
      CommonTools.postman,
    ],
    screenshots: [
      {
        id: 1,
        source: "https://picsum.photos/200/300",
        alt: "Playnoot Screenshot 1",
      },
      {
        id: 2,
        source: "https://picsum.photos/200/300",
        alt: "Playnoot Screenshot 2",
      },
      {
        id: 3,
        source: "https://picsum.photos/200/300",
        alt: "Playnoot Screenshot 3",
      },
    ],
    client: {
      name: "Ajay Sharma",
      image:
        "https://media.licdn.com/dms/image/C4D03AQEkMpc2u80IDA/profile-displayphoto-shrink_200_200/0/1642344338254?e=1700092800&v=beta&t=mfixJzjB-LDQ65yZjHrcCx_rFLTUC7Aw-StVTKPI9nU",
      review: "Mehndi Wala ",
      designation: "CEO / Founder",
      company: "Venyou Co.",
      location: "India",
    },
    team: [
      {
        name: "Ajay Sharma",
        image:
          "https://media.licdn.com/dms/image/C4D03AQEkMpc2u80IDA/profile-displayphoto-shrink_200_200/0/1642344338254?e=1700092800&v=beta&t=mfixJzjB-LDQ65yZjHrcCx_rFLTUC7Aw-StVTKPI9nU",
        designation: "CEO / Founder",
      },
      {
        name: "Ajay Sharma",
        image:
          "https://media.licdn.com/dms/image/C4D03AQEkMpc2u80IDA/profile-displayphoto-shrink_200_200/0/1642344338254?e=1700092800&v=beta&t=mfixJzjB-LDQ65yZjHrcCx_rFLTUC7Aw-StVTKPI9nU",
        designation: "Backend Developer",
      },
      {
        name: "Suyash Vashistha",
        image: "https://picsum.photos/200/300",
        designation: "Mobile Developer",
      },
    ],
    duration: "1 years",
    status: "completed",
  },
  {
    id: 5,
    title: "Sarithm Solutions",
    description:"We are Technical recruiters! We take pride in building bridges between Innovators and Developers. Our Global Technical recruiting team works round the clock, while you and your team focus on developing solutions.Trust, Time, Talent and Innovation are essential to business. Let's treat them with respect.We believe trust and open communication is the key to success in any business relationship. A deep understanding of the project, well defined requirements, and a solid tracking system lead to not only a successful result but also time saved. From the beginning we will ask the needed questions, and begin work immediately to increase efficiencies and to provide a quick turn around.",
    logo: "https://clutchco-static.s3.amazonaws.com/s3fs-public/logos/3c5232ded8feb1a5160267868a51b72f.png?VersionId=FD0U76IZmFSXj4OhA0r8I0lCCL7DwFAS",
    platform: "mobile",
    visit: {
      android: "https://www.google.com",
      ios: "https://www.google.com",
      web: "https://www.google.com",
    },
    type: "Service Based",
    location: "U.S Colorado",
    features: [
      "Developing multiple mobile applications",
      "Team management",
      "Client communication",
      "Training interns",      
      "Complex Architecture development",
    ],
    technologies: [
      CommonTools.reactNative,
      CommonTools.redux,
      CommonTools.firebase,
      CommonTools.reactQuery,
      CommonTools.node,
      CommonTools.androidStudio,
      CommonTools.xCode,
      CommonTools.git,
      CommonTools.postman,
      CommonTools.jira
    ],
    screenshots: [],
    client: {
      name: "Samson Gudise",
      image:
        "https://media.licdn.com/dms/image/D4D35AQEE0TdaO1abhg/profile-framedphoto-shrink_200_200/0/1693844701049?e=1694955600&v=beta&t=Nsl30Ai7lFLQbaIAiS5RqTRa7QgGOjtZQKZ_7FSktT4",
      review: "",
      designation: "Manager",
      company: "Sarithm Solutions",
      location: "U.S Colorado",
    },
    team: [
      {
        name: "Samson Gudise",
        image:
          "https://media.licdn.com/dms/image/D4D35AQEE0TdaO1abhg/profile-framedphoto-shrink_200_200/0/1693844701049?e=1694955600&v=beta&t=Nsl30Ai7lFLQbaIAiS5RqTRa7QgGOjtZQKZ_7FSktT4",
        designation: "Manager",
      },
      {
        name: "Ray Lewis",
        image:
          "https://media.licdn.com/dms/image/C4D03AQEkMpc2u80IDA/profile-displayphoto-shrink_200_200/0/1642344338254?e=1700092800&v=beta&t=mfixJzjB-LDQ65yZjHrcCx_rFLTUC7Aw-StVTKPI9nU",
        designation: "Backend Manager",
      },
      {
        name: "Anu Pama",
        image: "https://picsum.photos/200/300",
        designation: "Scrum Master",
      },
      {
        name: "Raghvi Movva",
        image: "https://picsum.photos/200/300",
        designation: "HR Manager",
      },
      {
        name: "Kashyap Patel",
        image: "https://picsum.photos/200/300",
        designation: "Mobile Developer",
      },
      {
        name: "Milan",
        image: "https://picsum.photos/200/300",
        designation: "Mobile Developer",
      },
      {
        name: "Jhanvi",
        image: "https://picsum.photos/200/300",
        designation: "Web/Mobile Intern",
      },
      {
        name: "Suyash Vashistha",
        image: "https://picsum.photos/200/300",
        designation: "Mobile Developer",
      },
    ],
    duration: "6 months",
    status: "in-progress",
  },
  {
    id: 3,
    title: "Playwise",
    description:
      "Playwise is an online social platform for gamers and the eSports community. Users can create their profiles, follow other users, create and join tournaments, watch leaderboards, chat with other users, and much more.",
    logo: "https://media.licdn.com/dms/image/C4D0BAQHxSZ2HbIa6fA/company-logo_200_200/0/1676907608333?e=1702512000&v=beta&t=WxbiuZ7pjX9l1WOz63gxuPfx1nsQujHmHebzObSYOxE",
    platform: "mobile",
    visit: {
      android: "https://www.google.com",
      ios: "https://www.google.com",
      web: "https://www.google.com",
    },
    type: "ESports",
    location: "India",
    features: [
      "Social Media Platform",
      "Mutli user platform",
      "Real time chats",
      "REST API",
      "Push notifications",
      "Local state management",
    ],
    technologies: [
      CommonTools.reactNative,
      CommonTools.redux,
      CommonTools.firebase,
      CommonTools.node,
      CommonTools.jira,
      CommonTools.androidStudio,
      CommonTools.xCode,
      CommonTools.git,
      CommonTools.postman,
    ],
    screenshots: [
      {
        id: 1,
        source: "https://picsum.photos/200/300",
        alt: "Playwise Screenshot 1",
      },
      {
        id: 2,
        source: "https://picsum.photos/200/300",
        alt: "Playwise Screenshot 2",
      },
      {
        id: 3,
        source: "https://picsum.photos/200/300",
        alt: "Playwise Screenshot 3",
      },
    ],
    client: {
      name: "Sunny Paliwal",
      image:
        "https://media.licdn.com/dms/image/D4D35AQEE0TdaO1abhg/profile-framedphoto-shrink_200_200/0/1693844701049?e=1694955600&v=beta&t=Nsl30Ai7lFLQbaIAiS5RqTRa7QgGOjtZQKZ_7FSktT4",
      review: "I am writing this letter to recommend Suyash for the position of Mobile Application Developer. I have had the pleasure of working with Suyash in Playwise where he was a valuable member of our team.Suyash is an exceptional mobile application developer with a keen eye for detail and a passion for creating high-quality, user-friendly applications. He has a thorough understanding of mobile application development and is proficient in various programming languages and frameworks, including JavaScript and React Native. Suyash is always up-to-date with the latest technologies and trends in mobile development, and he continuously seeks ways to improve his skills and knowledge.One of the most impressive things about Suyash is his ability to work well in a team environment. He is a great communicator and collaborator, always willing to lend a helping hand and share his expertise with others. Suyash has a positive attitude and is always eager to take on new challenges and projects.During his time at Playwise, Suyash played a crucial role in developing our flagship mobile application. He was involved in the entire development process, from ideation and prototyping to deployment and maintenance. Suyash's contributions to the project were significant, and his attention to detail and problem-solving skills were instrumental in ensuring its success.In summary, Suyash is a talented and dedicated mobile application developer who would be an excellent addition to any team. I highly recommend him for the position of mobile application developer at your organization, and I am confident that he will make a valuable contribution to your team.Please do not hesitate to contact me if you require any further information.",
      designation: "CEO / Founder",
      company: "Playwise",
      location: "India",
    },
    team: [
      {
        name: "Sunil Paliwal",
        image:
          "https://media.licdn.com/dms/image/D4D35AQEE0TdaO1abhg/profile-framedphoto-shrink_200_200/0/1693844701049?e=1694955600&v=beta&t=Nsl30Ai7lFLQbaIAiS5RqTRa7QgGOjtZQKZ_7FSktT4",
        designation: "CEO / Founder",
      },
      {
        name: "Aditya Sharma",
        image:
          "https://media.licdn.com/dms/image/C4D03AQEkMpc2u80IDA/profile-displayphoto-shrink_200_200/0/1642344338254?e=1700092800&v=beta&t=mfixJzjB-LDQ65yZjHrcCx_rFLTUC7Aw-StVTKPI9nU",
        designation: "Backend Developer",
      },
      {
        name: "Aman",
        image: "https://picsum.photos/200/300",
        designation: "Tech Lead",
      },
      {
        name: "Ankush",
        image: "https://picsum.photos/200/300",
        designation: "UI/UX Designer",
      },
      {
        name: "Suyash Vashistha",
        image: "https://picsum.photos/200/300",
        designation: "Mobile Developer",
      },
    ],
    duration: "1 years",
    status: "completed",
  },
  {
    id: 4,
    title: "Bluetris Technologies",
    description:"Bluetris Technologies is a leading IT company in India. We are providing various services like Web Development, Mobile App Development, Digital Marketing, and many more. We have a team of experts who are working on the latest technologies and providing the best services to our clients. We are working on various technologies like React Native, React JS, Node JS, Angular JS, PHP, Laravel, Codeigniter, WordPress, Magento, Shopify, and many more. We are providing the best services to our clients at a very affordable price. We are working on various projects like eCommerce, Social Media, CRM, ERP, and many more. We are providing the best services to our clients at a very affordable price. We are working on various projects like eCommerce, Social Media, CRM, ERP, and many more. We are providing the best services to our clients at a very affordable price. We are working on various projects like eCommerce, Social Media, CRM, ERP, and many more.",
    logo: "https://clutchco-static.s3.amazonaws.com/s3fs-public/logos/3c5232ded8feb1a5160267868a51b72f.png?VersionId=FD0U76IZmFSXj4OhA0r8I0lCCL7DwFAS",
    platform: "mobile",
    visit: {
      android: "https://www.google.com",
      ios: "https://www.google.com",
      web: "https://www.google.com",
    },
    type: "Service Based",
    location: "India",
    features: [
      "Developed multiple mobile applications",
      "Trained mobile dev intern",
      "Team management",
      "Client communication",
      "Complex Architecture development",
    ],
    technologies: [
      CommonTools.reactNative,
      CommonTools.redux,
      CommonTools.firebase,
      CommonTools.node,
      CommonTools.androidStudio,
      CommonTools.xCode,
      CommonTools.git,
      CommonTools.postman,
    ],
    screenshots: [],
    client: {
      name: "Kartik Prajapati",
      image:
        "https://media.licdn.com/dms/image/D4D35AQEE0TdaO1abhg/profile-framedphoto-shrink_200_200/0/1693844701049?e=1694955600&v=beta&t=Nsl30Ai7lFLQbaIAiS5RqTRa7QgGOjtZQKZ_7FSktT4",
      review: "I worked with suyash to develop several mobile apps and I would describe him as professional and enthusiastic developer who is proficient in his work. Suyash not only develops the app but also contributes to business through his experience and suggest best way to execute any flow.Me and my team has been working with suyash from last few months and he always amazes us with his remarkable skills.",
      designation: "Co-Founder",
      company: "Bluetris Technologies",
      location: "India",
    },
    team: [
      {
        name: "Kartik Prajapati",
        image:
          "https://media.licdn.com/dms/image/D4D35AQEE0TdaO1abhg/profile-framedphoto-shrink_200_200/0/1693844701049?e=1694955600&v=beta&t=Nsl30Ai7lFLQbaIAiS5RqTRa7QgGOjtZQKZ_7FSktT4",
        designation: "CEO / Founder",
      },
      {
        name: "Kamal",
        image:
          "https://media.licdn.com/dms/image/C4D03AQEkMpc2u80IDA/profile-displayphoto-shrink_200_200/0/1642344338254?e=1700092800&v=beta&t=mfixJzjB-LDQ65yZjHrcCx_rFLTUC7Aw-StVTKPI9nU",
        designation: "Project Manager",
      },
      {
        name: "Jyoti Gard",
        image: "https://picsum.photos/200/300",
        designation: "Backend Developer",
      },
      {
        name: "Ashwani",
        image: "https://picsum.photos/200/300",
        designation: "Backend Developer",
      },
      {
        name: "Suyash Vashistha",
        image: "https://picsum.photos/200/300",
        designation: "Mobile Developer",
      },
    ],
    duration: "1 years",
    status: "completed",
  },
];
