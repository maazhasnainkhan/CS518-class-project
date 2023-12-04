import React from "react";
import OpenAI from "openai";

const ActionProvider = ({ createChatBotMessage, setState, children }: any) => {
  // console.log("chatbot initialize");
  // const getabstractdata = String(localStorage.getItem("abstractdata"));

  const handleHello = async (message: string) => {
    const openai = new OpenAI({
      apiKey: "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",
      dangerouslyAllowBrowser: true,
    });
    const getabstractdata = String(localStorage.getItem("abstractdata"));
    // await openai.chat.completions.create({
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "Please read and understand this abstract for me, " +
    //         getabstractdata,
    //     },
    //   ],
    //   model: "gpt-3.5-turbo",
    // });
    setTimeout(async () => {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "Please read and understand this abstract for me, " +
              getabstractdata +
              "." +
              message,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      console.log(completion.choices[0].message.content);
      const botMessage = createChatBotMessage(
        completion.choices[0].message.content
      );

      setState((prev: any) => ({
        ...prev,
        messages: [...prev.messages, botMessage],
      }));
    }, 2000);
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: { handleHello },
        });
      })}
    </div>
  );
};

export default ActionProvider;
