---
layout: post
author: Shreyas Mocherla
title: Build an LLM-powered application with Gemini API Part 2
tags: [Chatbot, GenAI]
---

## Revisiting the Gemini API

The Gemini API, provided by Google AI Studio, enables developers to embed advanced language processing features into applications. It supports creating intelligent chatbots and generating responsive, human-like text, enhancing user interactions and engagement.

## Introduction to Google AI Studio

In the last tutorial, we learned how to create a simple chatbot using the Gemini API. Today, we'll explore Google AI Studio, a developer-friendly platform that lets you quickly build and deploy Gemini-powered applications.

## Prerequisites

To follow this tutorial, you should have:

- A personal Google account. If you don't have one, create a new account.
- Google AI Studio API key. You can get it by following the steps below.
- Basic knowledge of Python.
- A code editor like Visual Studio Code or Jupyter Notebook.

## Getting Started with Google AI Studio

First, let's get our API key from Google AI Studio, which is essential for accessing the Gemini API. This key allows us to integrate and utilize the powerful features of the Gemini API in our applications. **Remember to keep this key confidential to ensure your projects remain secure.**

### Steps to Get Your API Key:

1. **Sign into Google AI Studio**: Navigate to the Google AI Studio website at [Google AI Studio](https://aistudio.google.com/). Sign in using your Google account credentials.
2. **Acquire the API Key**: Once logged in, look for the "Get API Key" button—typically found on the top-left corner of the screen. Click on it to generate your API key.

With your API key secured, you're ready to engage with the Gemini API and build applications that can interact intelligently with users.

Place your API key in a `.env` file in the root directory of your project. The `.env` file should look like this:

```plaintext
GOOGLE_AI_API_KEY=your-api-key
```

Since the api key is in a file, if you are using a version control system like Git, make sure to add the `.env` file to your `.gitignore` file to prevent the key from being exposed.

## Building an LLM-powered Chatbot

Now that we have our API key, we will replicate the chatbot we built in the previous tutorial using Google AI Studio. This chatbot will be powered by the Gemini API and will be able to answer questions related to a given context.

I'll be assuming you already have the environment set up from the previous tutorial. If not, you can refer to the previous tutorial for detailed instructions on setting up the project.

There are some libraries that you need to install before you start building the chatbot. You can install them using the following commands:

```bash
pip install Pillow
pip install -U -q google-generativeai
pip install python-dotenv
pip install requests
```

### Writing the code

Here's the code snippet for the chatbot using the Gemini API in Google AI Studio:

```python
import google.generativeai as genai
import streamlit as st
from dotenv import load_dotenv, find_dotenv
import os
import time
import PIL

load_dotenv(find_dotenv())

genai.configure(api_key=os.getenv("GOOGLE_AI_API_KEY"))

st.title('Gemini Chatbot')

model = genai.GenerativeModel('gemini-1.5-pro-latest')

chat = model.start_chat(history=[])

def response_generator(prompt, image=None):
    if image:
        image = PIL.Image.open(image)
        response = chat.send_message([prompt, image],
                                     stream=True)
    else:
        response = chat.send_message(prompt,
                                     stream=True)
    
    for chunk in response:
        for word in chunk.text.split():
            yield word + " "
            time.sleep(0.05)

if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat messages from history on app rerun
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

uploaded_image = st.file_uploader("Upload an image of your code", type=['jpeg', 'png', 'jpg'])

# Accept user input
if prompt := st.chat_input("Enter your code here"):
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})
    # Display user message in chat message container
    with st.chat_message("user"):
        st.markdown(prompt)
    # Display assistant response in chat message container
    with st.chat_message("assistant"):
        stream = response_generator(prompt, uploaded_image)
        # Display assistant response in chat message container
        response = st.write_stream(stream)
    # Add assistant response to chat history
    st.session_state.messages.append({"role": "assistant", "content": response})
```

Save this code in a Python file named `chatbot.py`. This code will create a chatbot that uses the Gemini API to generate responses to user input. To run the chatbot, use the command `streamlit run chatbot.py`. This will start a local server where you can interact with your Gemini-powered chatbot.

## Conclusion

In this tutorial, we learned how to build a chatbot using the Gemini API in Google AI Studio. We were able to tap into the multimodal capabilities of Gemini, allowing us to handle not just text but also images seamlessly. With Google AI Studio, developers can leverage the power of advanced language models to build interactive applications that enhance user experience and drive innovation in AI-driven technologies.

[Google AI Studio]: https://aistudio.google.com/