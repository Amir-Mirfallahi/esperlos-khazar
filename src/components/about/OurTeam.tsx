import { Users } from 'lucide-react';
const OurTeam = () => {
  const team = [{
    name: "دکتر محمد محمدی",
    position: "مدیرعامل",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
  }, {
    name: "مهندس علی علوی",
    position: "مدیر فنی",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
  }, {
    name: "مهندس سارا سعیدی",
    position: "مدیر تحقیق و توسعه",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
  }];
  return <section className="bg-gray-50 py-[10px]">
      <div className="section-container">
        <div className="flex items-center gap-3 mb-12">
          <Users className="text-primary w-8 h-8" />
          <h2 className="text-3xl font-bold">تیم ما</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={member.imageUrl} alt={member.name} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.position}</p>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};
export default OurTeam;