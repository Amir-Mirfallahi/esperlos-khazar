import { Users } from "lucide-react";
import teamMembers from "@/data/team-members.json";
const OurTeam = () => {
  return (
    <section className="bg-gray-50 py-[10px]">
      <div className="section-container">
        <div className="flex items-center gap-3 mb-12">
          <Users className="text-primary w-8 h-8" />
          <h2 className="text-3xl font-bold">تیم ما</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              data-aos="fade-up"
              data-aos-duration={index * 300}
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-400">تصویری یافت نشد</p>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default OurTeam;
