// TODO: Fetch this data from backend/CMS API once available.
// For now this file is the single source of truth, sourced directly
// from the Swasti Foundation Requirements Document.

export const orgInfo = {
  name: "Swasti Foundation",
  tagline: "नर सेवा ही नारायण सेवा है।",
  // English gloss of the Hindi tagline above, for accessibility/SEO — not a
  // separate line from the requirements document, which gives only the
  // Hindi original.
  taglineTranslation: "Service to mankind is service to the divine.",
  foundedDate: "2020-02-25",
  foundedYear: 2020,
  registeredAt: "Central govt, State govt, Niti Ayog",
  type: "Trust",
  officeAddress: "H.No. 260/4, Main Road, Chhattarpur, New Delhi 110074",
  correspondenceAddress: "H.No. 167, Rajpur Khurd Extension, South Delhi 110068",
  branchLocations: ["Karol Bagh", "Rajpur", "Chhattarpur"],
  email: "Foundationswasti@gmail.com",
  phone: "8459073474",
  // TODO: Replace with NGO WhatsApp Number. Requirements document lists this
  // number as "459073474" (9 digits) — verify with the organisation whether
  // a digit is missing before going live, as wa.me links require a full
  // international-format number to work correctly.
  whatsappNumber: "459073474",
  social: {
    // TODO: Replace with actual NGO social media links
    facebook: "#",
    instagram: "#",
    youtube: "#",
  },
};

export const aboutContent = {
  whyFounded:
    "Swasti Foundation was founded with the belief that meaningful social transformation begins with equal opportunities and collective responsibility. The Foundation was established to bridge critical gaps in education, healthcare, livelihood, and community development by implementing sustainable, impact-driven initiatives. Through strategic partnerships, grassroots engagement, and a commitment to excellence, Swasti Foundation strives to empower individuals, strengthen communities, and contribute towards building a more inclusive and sustainable future.",
  problem:
    "Millions of individuals continue to face barriers to quality education, accessible healthcare, sustainable livelihoods, and equal opportunities. Social and economic inequalities often prevent vulnerable communities from achieving long-term growth and self-reliance. Limited access to essential resources, awareness, and support systems further widens these gaps, affecting the overall well-being and development of society. Addressing these challenges requires sustained, community-driven efforts that create lasting and measurable impact.",
  founderStory:
    "Swasti Foundation was founded by Shailesh Shastri with a vision to create meaningful and lasting social impact. Driven by the belief that every individual deserves equal opportunities to grow with dignity, he established the Foundation to address the challenges faced by underserved communities through sustainable and community-centric initiatives. Under his leadership, Swasti Foundation continues to work towards empowering individuals, strengthening communities, and creating positive change through compassion, integrity, and collective action.",
  inspiration:
    "Swasti Foundation was inspired by the belief that meaningful change begins when compassion is transformed into action. Witnessing the challenges faced by underserved communities—including limited access to education, healthcare, and livelihood opportunities—strengthened the resolve to create an organization dedicated to sustainable social development. The Foundation was established with the vision of empowering individuals, fostering self-reliance, and building stronger, more inclusive communities through consistent and impactful initiatives.",
  mission:
    "At Swasti Foundation, our mission is to empower underserved communities by creating equitable access to education, healthcare, sustainable livelihood opportunities, and social welfare initiatives. We are committed to fostering inclusive growth through community-driven programs, strategic partnerships, and sustainable development practices that enable individuals to lead lives of dignity, self-reliance, and purpose. Through integrity, compassion, and collective action, we strive to create a lasting and measurable social impact for present and future generations.",
  vision:
    "At Swasti Foundation, our vision is to build a compassionate, inclusive, and self-reliant society where every individual has access to opportunities that promote dignity, well-being, and sustainable development. We aspire to create lasting social impact through initiatives in education, healthcare, community welfare, and livelihood development while fostering a culture of empathy, responsibility, and collective progress.",
  visionExtended:
    "As part of our long-term vision, Swasti Foundation aims to establish and support initiatives such as Gaushalas (cow shelters) for the protection and welfare of animals, and Old Age Homes that provide care, dignity, and a nurturing environment for senior citizens. Through these efforts, we seek to create a holistic ecosystem of social welfare that serves people and communities across generations.",
  coreValues: [
    {
      id: "transparency",
      name: "Transparency",
      description: "Open, honest reporting of how every contribution creates change.",
    },
    {
      id: "integrity",
      name: "Integrity",
      description: "Doing what is right, consistently, even when no one is watching.",
    },
    {
      id: "equality",
      name: "Equality",
      description: "Equal dignity and opportunity for every individual we serve.",
    },
    {
      id: "sustainability",
      name: "Sustainability",
      description: "Building solutions that outlast a single donation or season.",
    },
    {
      id: "empowerment",
      name: "Empowerment",
      description: "Helping people build the means to stand on their own.",
    },
  ],
};

export const founderMessage = {
  founderName: "Shailesh Shastri",
  founderTitle: "Founder, Swasti Foundation",
  letter: [
    "Dear Friends,",
    "It is with great humility and a deep sense of responsibility that I welcome you to Swasti Foundation.",
    "Our journey began with a simple yet powerful belief—that meaningful change is possible when compassion is translated into action. Every individual deserves the opportunity to live with dignity, access essential resources, and realize their full potential. With this vision, Swasti Foundation was established to serve communities through sustainable initiatives in education, healthcare, community welfare, and social development.",
    "At Swasti Foundation, we believe that lasting transformation is achieved through collaboration, integrity, and a steadfast commitment to service. Every initiative we undertake is guided by the aspiration to empower individuals, strengthen communities, and create opportunities that inspire self-reliance and long-term progress.",
    "As we look towards the future, our vision extends beyond today's initiatives. We aspire to establish Gaushalas dedicated to animal welfare and Old Age Homes that provide care, dignity, and a supportive environment for senior citizens. These long-term goals reflect our commitment to building a compassionate and inclusive society where every life is valued.",
    "I extend my heartfelt gratitude to our volunteers, supporters, partners, and well-wishers whose trust and dedication make this journey possible. Together, let us continue working towards creating a future defined by hope, equality, and sustainable social impact.",
  ],
  closing: "With sincere regards,",
};

export const leadershipTeam = [
  { name: "Shailesh Shastri", role: "Chairperson" },
  { name: "Veena Jajoria", role: "President" },
  { name: "Mukesh Kumar", role: "Vice President" },
  { name: "Neetu Kumari", role: "Vice President" },
  { name: "Varun Singh Rathore", role: "Vice-Chairperson" },
  { name: "Dr. Devesh Arya", role: "Vice-Chairperson" },
  { name: "Archana Singh", role: "General Secretary" },
  { name: "Anjili", role: "Treasurer" },
];

export const areasOfWork = [
  { id: "education", name: "Education", icon: "BookOpen" },
  { id: "women-empowerment", name: "Women Empowerment", icon: "Users" },
  { id: "healthcare", name: "Healthcare", icon: "HeartPulse" },
  { id: "child-welfare", name: "Child Welfare", icon: "Baby" },
  { id: "environment", name: "Environment", icon: "Leaf" },
  { id: "skill-development", name: "Skill Development", icon: "Hammer" },
  { id: "rural-development", name: "Rural Development", icon: "Home" },
  { id: "animal-welfare", name: "Animal Welfare", icon: "PawPrint" },
];

export const programs = [
  {
    id: "bal-sanskar-pathshala",
    name: "Bal Sanskar Pathshala",
    category: "Education",
    locations: ["Jharkhand", "Delhi", "Aligarh", "Muradabad", "Gurgaon", "Rajasthan"],
    description:
      "Bal Sanskar Pathshala is an initiative of Swasti Foundation dedicated to nurturing children through value-based education, moral development, and holistic learning. Beyond academics, the program focuses on instilling discipline, compassion, respect, cultural values, and a sense of social responsibility. By creating a supportive and inspiring learning environment, Bal Sanskar Pathshala aims to empower young minds with the knowledge, confidence, and character needed to become responsible citizens and future leaders.",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "vriksharopan",
    name: "Vriksharopan",
    category: "Environment",
    locations: [],
    description:
      "Vriksharopan is an environmental initiative by Swasti Foundation focused on promoting ecological sustainability through tree plantation drives. By encouraging community participation and environmental awareness, the initiative aims to create greener surroundings, improve air quality, and contribute towards a healthier and more sustainable future.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "yog-diwas",
    name: "Yog Diwas",
    category: "Healthcare",
    locations: [],
    description:
      "Swasti Foundation celebrates International Yoga Day to promote physical well-being, mental wellness, and a healthy lifestyle. Through yoga sessions and awareness programs, the initiative encourages individuals of all ages to embrace holistic health, mindfulness, and the importance of preventive healthcare.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ambedkar-baba-sahab-program",
    name: "Ambedkar Baba Sahab Program",
    category: "Education",
    locations: [],
    description:
      "Swasti Foundation organizes Dr. B. R. Ambedkar Jayanti programs to honor the life, vision, and contributions of Dr. B. R. Ambedkar towards equality, social justice, and constitutional values. The initiative promotes awareness about education, empowerment, and the importance of building an inclusive and equitable society.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "sashakt-silai-kendra",
    name: "Sashakt Silai Kendra",
    category: "Women Empowerment",
    locations: ["Karol Bagh"],
    description:
      "Sashakt Silai Kendra is a flagship women empowerment program of Swasti Foundation that provides professional tailoring and stitching training to women from economically disadvantaged communities. By equipping participants with practical vocational skills, the initiative promotes self-reliance, entrepreneurship, and sustainable livelihood opportunities, enabling women to build a brighter future for themselves and their families.",
    image: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "life-matters-campaign",
    name: "Life Matters Campaign",
    category: "Healthcare",
    locations: [],
    description:
      "Life Matters Campaign is a mental health awareness initiative by Swasti Foundation dedicated to promoting emotional well-being, reducing stigma around mental health, and encouraging individuals to seek timely support. Through awareness sessions, community outreach, and educational programs, the campaign fosters hope, resilience, and the importance of reaching out during challenging times.",
    image: "https://res.cloudinary.com/ykdovzl1/image/upload/v1784055779/gm93lhbh0h30lsq32cgk.png",
  },
];

export const impactStats = [
  { id: "children-educated", value: 5000, suffix: "+", label: "Children Educated" },
  { id: "ration-distributed", value: 20000, suffix: "+", label: "Ration Distributed" },
  { id: "states-reached", value: 10, suffix: "+", label: "States Reached" },
  { id: "cleanliness-kits", value: 10000, suffix: "+", label: "Cleanliness Kits Distributed" },
];

export const successStories = [
  {
    id: "ritik-aggarwal",
    name: "Ritik Aggarwal",
    program: "Sports Empowerment",
    summary:
      "A young cricketer from an underprivileged background who, with Swasti Foundation's support, went on to earn Player of the Match honours after an unbeaten 153 off 66 balls.",
    story:
      "At Swasti Foundation, we believe that talent should never be limited by financial or social circumstances. One such inspiring example is Ritik Aggarwal, a young and determined cricketer whose journey reflects the power of opportunity, guidance, and perseverance. Coming from an underprivileged background, Ritik received encouragement and support from Swasti Foundation to pursue his passion for cricket. With consistent training, dedication, and hard work, he steadily developed his skills and began making a mark in competitive cricket. Over the years, Ritik has earned recognition through outstanding performances and has won several medals and accolades in various cricket tournaments. One of his most remarkable achievements came when he was named Player of the Match after scoring an unbeaten 153 runs off just 66 balls and taking 2 wickets, leading his team to a convincing 9-wicket victory. Ritik's journey is a reflection of Swasti Foundation's commitment to identifying potential, nurturing dreams, and empowering young individuals to achieve excellence.",
    image: "https://images.unsplash.com/photo-1531415080290-bc9b8996bc64?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "anuj-arya",
    name: "Anuj Arya",
    program: "Bal Sanskar Pathshala",
    summary:
      "A Bal Sanskar Pathshala beneficiary whose value-based education and mentorship helped him secure a respectable professional position.",
    story:
      "Anuj Arya is a proud beneficiary of Swasti Foundation's Bal Sanskar Pathshala, where he received educational support, guidance, and value-based learning during his formative years. With dedication, perseverance, and the strong foundation built through the Pathshala, Anuj successfully pursued his education and has now secured a respectable professional position. His journey reflects how access to quality education, mentorship, and the right opportunities can transform lives. Today, Anuj's success stands as an inspiration for many young learners, reinforcing Swasti Foundation's commitment to empowering children through education and helping them build a brighter and self-reliant future.",
    image: "https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?auto=format&fit=crop&w=800&q=80",
  },
];

export const volunteers = [
  { name: "Ashwini", role: "Event Management" },
  { name: "Krishna Garg", role: "Technical Coordinator" },
  { name: "Aditya Kumar", role: "Technical Coordinator" },
];

export const corporatePartners = {
  companies: ["Alimco", "Vandu Namkeen"],
  schools: ["Avanti Sai Public School, Muradabad"],
  colleges: ["OASIS Global University"],
};

// TODO: Fetch events from backend/CMS API
export const events = [];

// TODO: Fetch blog posts from backend/CMS API
export const blogPosts = [];


