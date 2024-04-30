---
layout: post
author: Shreyas Mocherla
tags: [overview, GenAI]
---
# Build an LLM-powered application with the Gemini API

First things first, what is Gemini? Gemini is an LLM that is a response to OpenAI's GPT model. It is a large language model that is trained on a diverse range of text data and is capable of generating human-like text. Gemini is a powerful tool that can be used for a variety of applications, such as chatbots, content generation, and more.

Today we'll explore a fraction of what Gemini can do by building a simple application that uses the Gemini API. The Gemini API allows you to interact with the Gemini model and generate text using the model. In this tutorial, we'll build a simple chatbot that uses the Gemini API to generate responses to user input. **Best of all, the Gemini API is currently free to use, so you can start building with it right away!**

## Prerequisites

There is a lot of documentation on Gemini where you can get lost in the details. But don't worry, I'll guide you through the process of building a simple chatbot using the Gemini API. Here are the prerequisites for this tutorial:

- Basic knowledge of Python
- A Google Cloud project set up and Vertex AI API enabled
- Code IDE (I'll be using VS Code)
- Vertext AI Python SDK installed

## Setting up the project

First, let's set up the project structure. Create a new directory for your project and create a new Python file called `chatbot.py`. In this file, we'll write the code for our chatbot.

Next, let's install the Google Cloud CLI and the Vertex AI Python SDK. You can do this by going to [Install Google Cloud CLI page](https://cloud.google.com/sdk/docs/install).

After running these commands, we want to create a new Google Cloud project and enable the Vertex AI API. You can do this by following the instructions in the [Google Cloud documentation](https://cloud.google.com/vertex-ai/docs/start/cloud-environment).

Apart from the above steps, you will also need a library that you can build an application with. For this tutorial, we'll be using "streamlit" which is a Python library that allows you to create interactive web applications with just a few lines of code. You can install streamlit by running the following command:

```bash

pip install streamlit
    
```

## Writing the code

Now let's write the code for our chatbot. Here's a simple chatbot that uses the Gemini API to generate responses to user input:

```python

import vertexai
import time
import streamlit as st
from vertexai.generative_models import GenerativeModel

# Initialize the Vertex AI client

vertexai.init(project='your-project-id',
            location='configured-location')

# Create a function to generate a response using the Gemini API

def generate_response(input_text):
    model = GenerativeModel(model_name="gemini-1.0-pro")
    response = model.generate_content(input_text)
    for word in response.candidates[0].text.split():
        yield word + " "
        time.sleep(0.05)


# Create a Streamlit app to interact with the chatbot

st.title('Gemini Chatbot')
if prompt := st.chat_input("Enter your code here"):
    with st.chat_message("user"):
        st.markdown(prompt)
    with st.chat_message("assistant"):
        response = generate_response(prompt)
        st.write_stream(response)
```

That's it! You've just built a simple chatbot that uses the Gemini API to generate responses to user input. You can now run the chatbot by running the following command:

```bash

streamlit run chatbot.py
    
```

This will start a local web server that you can access in your browser. You can now interact with the chatbot by entering text in the chat input box. The chatbot will use the Gemini API to generate responses to your input.

## Conclusion

In this tutorial, we explored how to build a simple chatbot using the Gemini API. The Gemini API is a powerful tool that can be used for a variety of applications, and I encourage you to explore its capabilities further. I hope you found this tutorial helpful, and I look forward to seeing what you build with the Gemini API!

This was part one of a series of tutorials on building applications with the Gemini API.

In the upcoming tutorials, we'll expand on this chatbot and explore more advanced features of the Gemini API. Stay tuned!