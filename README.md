# llm-plugin-tester

[llm-plugin-tester.vercel.app/](https://llm-plugin-tester.vercel.app/)

This is a simple Nextjs application that demonstrates how a PLugins System can interact with external APIs. The model helps users with their questions, by makeing requests to the APIs, based on user inputs.
The user provides a URL that points to a JSON file containing API plugin information. The JSON file should have the [following structure](https://platform.openai.com/docs/plugins/getting-started/plugin-manifest)

![image](https://user-images.githubusercontent.com/64021988/231303548-b25c99ca-bbce-49b8-bbf4-a3b81e59eb9f.png)

## Features

- Add Plugins by providing a URL like `http://yourdomain/.well-known/ai-plugin.json`
- Manage API plugins (add, remove, view YAML)
- Enter OpenAI API Key
- Enter a user input/query 
- See the full prompt that will be sent to the model "behind the scenes"
- Run the prompt and network request to fetch information from the API
- Display the models's response based on the fetched data

You can use OpenAI's QQuickstart plugin for testing: https://github.com/openai/plugins-quickstart
---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Local development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
