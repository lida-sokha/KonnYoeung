import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DashboardLayout from "../../components/Layout/Sections/DashboardLayout";
import { Search, Mic, Globe } from "lucide-react";

const ArticleDetail = () => {
  //const { id } = useParams();
  const navigate = useNavigate();

  const [language, setLanguage] = useState("EN");
  const [activeTab, setActiveTab] = useState("All");

  const tabs = [
    "All",
    "Symptoms",
    "Illness",
    "Emergency",
    "First-Aids",
    "Prevention & Care",
  ];

  const article = {
    title:
      "How can I ensure that my child under 6 months has antibodies to prevent the common cold?",
    author: "Nu Sophan",
    updatedDate: "27 March 2025",
    reviewer:
      "Dr. Chan Sineth · Obstetrics and Gynecology Specialist · Cambodia-China Friendship Hospital, Sen Sok",

    content: [
      {
        type: "paragraph",
        text: `Every year, millions of children contract the flu, thousands are hospitalized, and some die from the disease.
        Mothers can protect their young children from this disease by getting vaccinated. The flu vaccine helps boost the immune system in children.
        Vaccination against influenza can reduce the severity of the disease, make it easier to treat, and is not life-threatening if a child gets the disease.
        However, this vaccine can only be given to children who are 6 months old or older.So if we want babies under 6 months old to have antibodies against influenza, 
        what should mothers do?`,
      },
      {
        type: "image",
        url: "https://womenhope.org/wp-content/uploads/2025/10/Women-Hope_pic-20-1536x1152.jpg",
      },
      {
        type: "paragraph",
        text: `Influenza, or the flu, is a contagious disease that has two types: Flu A and Flu B, which affect our health.
        The symptoms of the common cold are similar to the flu, but are more severe, develop more quickly, and are more dangerous.
        The flu can cause serious complications such as pneumonia, bronchitis, sinusitis, ear infections (otitis media), dehydration, 
        brain damage, and worsening of existing heart conditions, asthma, or diabetes If it occurs in children under 5 years of age, 
        especially children under 2 years of age, pregnant women, the elderly over 65 years of age, asthmatics, heart patients, diabetics, 
        or those with weakened immune systems, etc.In severe cases, the flu can be life-threatening..`,
      },
      {
        type: "image",
        url: "https://st5.depositphotos.com/1655708/72150/i/600/depositphotos_721501220-stock-photo-mother-holding-comforting-her-crying.jpg",
      },
      {
        type: "paragraph",
        text:`Dr. Pen Kakada, a pediatrician and pediatrician working at Angkor Children's and Infants Clinic, said that in general, for safety reasons, 
        it is recommended that children be vaccinated against the flu from the age of 6 months and up.But if a child under 6 months old gets the flu, 
        it can be serious and have serious consequences. So the best and safest way is to vaccinate the mother against the flu influenza.
        Pregnant mothers can get the flu vaccine from pregnancy until birth, at any time.If the mother is in poor health or is at risk of contracting the flu, 
        doctors recommend getting the vaccine as soon as possible.However, if the mother is in good health and not prone to catching the flu, doctors recommend 
        that pregnant mothers get the flu vaccine in the last or third trimester because the vaccine's effectiveness lasts for a year.If mothers get vaccinated 
        in the last trimester of pregnancy, antibodies may be passed on to their babies. Babies born before 6 months of age may have antibodies to the flu, and 
        mothers can bring their babies to get vaccinated against the flu when they are 6 months old.Also, if mothers did not get the flu vaccine during pregnancy, 
        they can get it while breastfeeding because antibodies can pass to the baby through breast milk.`,
      },
      {
        type: "heading",
        text: "Important Point",
      },
      {
        type: "list",
        text:"To ensure that children under 6 months of age have antibodies to prevent the common cold, mothers should:",
        items: [
          "Get vaccinated against influenza in the last or third trimester of pregnancy if the mother is healthy and not at risk of contracting influenza.",
          "Get vaccinated against the flu during breastfeeding if mothers did not get vaccinated during pregnancy.",
        ],
      },
    ],
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-6">

        {/* Search + Profile */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div className="flex items-center bg-gray-200 rounded-full px-3 py-2 w-full md:w-72">
            <Search size={16} className="text-gray-500" />
            <input
              placeholder="Search"
              className="bg-transparent outline-none flex-1 mx-2 text-sm"
            />
            <Mic size={16} className="text-gray-500 cursor-pointer" />
          </div>

          <div className="flex items-center gap-4 self-end md:self-auto ">
            <button
              onClick={() =>
                setLanguage(language === "EN" ? "KH" : "EN")
              }
              className="flex items-center gap-1 text-gray-700 hover:text-black"
            >
              <Globe size={18}  />
              <span className="font-medium">{language}</span>
            </button>

            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Profile"
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-full cursor-pointer border hover:opacity-80 ml-6"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-10 overflow-x-auto border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-base whitespace-nowrap relative ${
                activeTab === tab
                  ? "font-medium text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Article */}
        <div className="lg:col-span-2 space-y-6">

          <h1 className="text-3xl font-bold text-gray-800">
            {article.title}
          </h1>

          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Written by :</span>{" "}
              {article.author}
            </p>

            <p>
              <span className="font-medium">Updated on :</span>{" "}
              {article.updatedDate}
            </p>

            <p>
              <span className="font-medium">Reviewed by :</span>{" "}
              {article.reviewer}
            </p>
          </div>

          {article.content.map((block, i) => {
            if (block.type === "paragraph")
              return (
                <p key={i} className="text-gray-700 leading-relaxed">
                  {block.text}
                </p>
              );

            if (block.type === "heading")
              return (
                <h2 key={i} className="text-xl font-semibold">
                  {block.text}
                </h2>
              );

            if (block.type === "image")
              return (
                <img
                  key={i}
                  src={block.url}
                  className="rounded-xl w-full object-cover"
                />
              );

            if (block.type === "list" && block.items)
              return (
                <ul key={i} className="list-disc pl-5 space-y-1 text-gray-700">
                  {block.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              );

            return null;
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Advertisement */}
          <a href="https://cadt.edu.kh/" target="_blank">
            <img
              src="https://cambodiainvestmentreview.com/wp-content/uploads/2022/03/CADT-0-scaled.jpg"
              className="rounded-lg w-full object-cover hover:opacity-90 transition"
            />
          </a>

          {/* Latest posts */}
          <div>
             <h3 className="font-semibold border-y my-3 pb-2 text-xl text-center">
                 Latest post
              </h3> 
         
            <div>
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  onClick={()=>navigate(`/article/${n}`)}
                  className="flex gap-3 hover:bg-gray-100 p-2 rounded cursor-pointer border-b border-gray-300 "
                >
                  <img
                    src="https://www.beyfortus.com/.imaging/default/dam/Marketing/Beyfortus-new-consumer-sites/what-is-rsv/GettyImages-1369926465.png/jcr:content.png"
                    className="w-24 h-20 object-cover rounded"
                  />
                 <div>
                    <p className="font-sm">
                      Why should babies be vaccinated?
                    </p>

                    <p className="text-xs text-gray-500">
                      {article.updatedDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Advertisement */}
          <a href="https://www.airbnb.com/" target="_blank">
            <img
              src="https://a0.muscache.com/im/pictures/hosting/Hosting-1496408576612343725/original/18f510c4-44bb-4546-ab01-4fba94df223d.jpeg"
              className="rounded-lg w-full object-cover hover:opacity-90 transition"
            />
          </a>

          {/* Recommended */}
          <div>
            <h3 className="font-semibold my-3 border-y pb-2 text-xl text-center ">
              Recommend
            </h3>

            <div className="divide-y divide-gray-300">
              {[4, 5, 6].map((n) => (
                <div
                 key={n} 
                 onClick={()=> navigate(`/article/${n}`)}
                 className="hover:bg-gray-100 relative cursor-pointer py-3">
                  <img
                    src={`https://www.vickerypediatrics.com/wp-content/uploads/2019/12/winter-viruses-impacting-kids.jpg.webp`}
                    className="rounded-lg w-full h-46 object-cover "
                  />
                  <p className="absolute bottom-2 -translate-x-1/2 left-1/2  text-center text-white text-lg font-semibold bg-black/20 w-full px-3 py-2 rounded">
                    These diseases often occur in young children in the winter. How should parents prevent them?
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArticleDetail;
