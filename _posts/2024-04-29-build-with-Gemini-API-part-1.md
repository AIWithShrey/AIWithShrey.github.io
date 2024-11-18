---
layout: post
author: Shreyas Mocherla
title: Build an LLM-powered application with Gemini API Part 1
tags: [Chatbot, GenAI]
---

## Introduction to Gemini API

Gemini is a state-of-the-art LLM created by Google DeepMind, designed for multimodal applications enabling seamless integration across text, images, code, and audio. This large language model stands out due to its performance benchmarks, showing impressive capabilities over GPT models in various standard tests like MMLU, DROP, and HellaSwag​.

## Getting Started with the Gemini API

Today, we'll embark on creating a simple yet powerful application using the Gemini API. The API is freely available, making it an accessible choice for developers keen to explore AI-powered applications without initial investment​.

## Prerequisites

To follow this tutorial, you should have:

- Basic knowledge of Python.
- A Google Cloud project with Vertex AI API enabled.
- Visual Studio Code or another code IDE.
- The Vertex AI Python SDK installed.

## Setting up the project

1. **Initialize your project**: Start by setting up your project directory and creating a Python file named `chatbot.py`.
2. **Install necessary tools**: Ensure the Google Cloud CLI and Vertex AI Python SDK are installed. Detailed instructions are available on the Google Cloud documentation page.
3. **Streamlit installation**: Install Streamlit using `pip install streamlit`, which will help in creating an interactive web app for the chatbot.

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

Run your chatbot with streamlit run chatbot.py. This command starts a local server where you can interact with your Gemini-powered chatbot.

## Exploring Advanced Features

As you get comfortable with the basics, consider delving into the multimodal capabilities of Gemini, which allow it to handle not just text but also images, audio, and code seamlessly. This makes Gemini particularly powerful for applications requiring cross-modal data handling​.

## Conclusion

This tutorial provides a foundation for building applications using the Gemini API. As Gemini offers extensive documentation and community support, it’s an excellent opportunity to expand your skills in AI application development. Stay tuned for more advanced tutorials in this series!
