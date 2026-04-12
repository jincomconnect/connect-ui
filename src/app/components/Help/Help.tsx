import { motion } from "motion/react";
import { HelpCircle, BookOpen, MessageSquare, Mail, FileText, Users } from "lucide-react";
import "./Help.css";

export function Help() {
  const helpTopics = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics of using CommunityHub",
      color: "blue"
    },
    {
      icon: Users,
      title: "Community Guidelines",
      description: "Understand our community standards and best practices",
      color: "purple"
    },
    {
      icon: MessageSquare,
      title: "Contact Support",
      description: "Get help from our support team",
      color: "green"
    },
    {
      icon: FileText,
      title: "FAQ",
      description: "Frequently asked questions and answers",
      color: "orange"
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Help & Support</h1>
          <p className="text-neutral-600">Find answers and get assistance</p>
        </motion.div>

        {/* Help Topics Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {helpTopics.map((topic, index) => {
            const Icon = topic.icon;
            const colorClasses = {
              blue: "bg-blue-100 text-blue-600",
              purple: "bg-purple-100 text-purple-600",
              green: "bg-green-100 text-green-600",
              orange: "bg-orange-100 text-orange-600"
            };

            return (
              <motion.button
                key={topic.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-neutral-200 p-6 text-left hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 rounded-lg ${colorClasses[topic.color as keyof typeof colorClasses]} flex items-center justify-center mb-4`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">{topic.title}</h3>
                <p className="text-sm text-neutral-600">{topic.description}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-neutral-200 p-8 text-center"
        >
          <Mail className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Still need help?</h2>
          <p className="text-neutral-600 mb-6">Our support team is here to assist you</p>
          <button className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors">
            Contact Support
          </button>
        </motion.div>
      </div>
    </div>
  );
}
