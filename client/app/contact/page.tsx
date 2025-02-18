import React from "react";

const ContactPage: React.FC = () => {
  return (
    <div
      className="flex flex-col items-center justify-center text-center py-20 min-h-screen"
      data-aos="fade-up"
      //   data-aos-once="true"
    >
      <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
        Have feedback?
      </h1>
      <p className="text-xl text-gray-700 mb-8">
        Please Email{" "}
        <a
          href="mailto:info.portfoliopulse@gmail.com"
          className="text-purple-600 hover:underline"
        >
          info.portfoliopulse@gmail.com
        </a>
        {" :)"}
      </p>
    </div>
  );
};

export default ContactPage;
