import React, { useState } from "react";
const prompt_prefix = `You are a virtual assistant that helps users with their questions by relying on
information from HTTP APIs. When the user asks a question, you should determine whether
you need to fetch information from the API to properly answer it. If so, you will
request the user to provide all the parameters you need, and then ask them to run the
request for you. When you are ready to ask for a request, you should specify it using
the following JSON syntax:

"""
{
"url": "<request URL>",
"method": "<method>",
"body": {<json request body>},
"headers": {<json request headers>}
}
"""

Replace in all the necessary values the user provides during the interaction, and do not
use placeholders. You have to follow the exmaple structure exactly!

The following APIs are available to you:

---
`;

const App = () => {
  const [url, setUrl] = useState("");
  const [data, setData] = useState([]);
  const [inputField, setInputField] = useState("");
  const [apiKey, setApiKey] = useState(
    ""
  );
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(url);
      const jsonData = await response.json();
      const yamlResponse = await fetch(jsonData.api.url);
      const yamlData = await yamlResponse.text();
      setData([...data, { ...jsonData, yaml: yamlData, showYaml: false }]);
    } catch (error) {
      alert(error);
      console.error("Error fetching data:", error);
    }
  };

  const handleExampleRequest = async () => {
    setIsLoading(true);
    const requestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content:
            prompt_prefix +
            data[0].yaml +
            "\n\n\n" +
            inputField +
            "  \n\n\nJSON or answer:",
        },
      ],
      temperature: 0.2,
    };

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      const data = await response.json();

      const generatedText = data.choices[0].message.content;
      setAnswer(generatedText);

      const jsonObject = JSON.parse(generatedText);

      const requestOptions = {
        method: jsonObject.method,
        headers: jsonObject.headers,
      };

      // Only include the body property if the method is not GET or HEAD
      if (jsonObject.method !== "GET" && jsonObject.method !== "HEAD") {
        requestOptions.body = JSON.stringify(jsonObject.body);
      }

      const newResponse = await fetch(jsonObject.url, requestOptions);

      const newResponseData = await newResponse.json();

      const requestBody2 = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content:
              `Q: ${inputField}. Formulate a assistants answer to the user, the response from the api was:` +
              newResponse +
              "A:",
          },
        ],
        temperature: 0.7,
      };

      const response2 = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(requestBody2),
        }
      );
      const data2 = await response2.json();

      const generatedText2 = data2.choices[0].message.content;
      setAnswer(generatedText2);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeData = (indexToRemove) => {
    setData(data.filter((_, index) => index !== indexToRemove));
  };

  const toggleYaml = (index) => {
    setData(
      data.map((item, idx) =>
        idx === index ? { ...item, showYaml: !item.showYaml } : item
      )
    );
  };

  return (
    <div className="container mx-auto px-4">
      <form onSubmit={handleSubmit} className="flex justify-center my-4">
        <input
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="Enter URL: http://yourdomain/.well-known/ai-plugin.json"
          className="border-2 border-gray-300 rounded-l p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded-r">
          Add Plugin
        </button>
      </form>

      {data.map((item, index) => (
        <div key={index} className="p-2 mb-2 bg-gray-100 rounded">
          <div className="flex justify-between items-center">
            <span>{item.name_for_human}</span>
            <button
              onClick={() => removeData(index)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              X
            </button>
          </div>
          <div className="my-2">
            <button
              onClick={() => toggleYaml(index)}
              className="bg-yellow-500 text-white px-2 py-1 rounded mb-2"
            >
              {item.showYaml ? "Minimize YAML" : "Maximize YAML"}
            </button>
            {item.showYaml && <pre>{item.yaml}</pre>}
          </div>
        </div>
      ))}
      <div id="api-key">
        <input
          type="text"
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
          placeholder="Enter OpenAI API Key"
          className="border-2 border-gray-300 rounded-l p-2 w-full my-4"
        />
      </div>
      <div className="example-request">
        <input
          type="text"
          value={inputField}
          onChange={(event) => setInputField(event.target.value)}
          placeholder="Enter your input for the example"
          className="border-2 border-gray-300 rounded-l p-2 w-full my-4"
        />
        <h2>Current full prompt</h2>
        <textarea
          type="text"
          value={
            prompt_prefix +
            (data[0]?.yaml || "") +
            "\n\n\n" +
            inputField +
            "  \n\n\n JSON or answer:"
          }
          className="border-2 border-gray-500 rounded p-2 w-full h-44 my-4"
          readOnly
        />
        <button
          onClick={handleExampleRequest}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Run Prompt & Network Request"}
        </button>
        <div className="result-container my-4">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default App;
