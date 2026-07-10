---
layout: page
title: Writing
description: Technical articles on AI agents, Kubernetes, cloud-native development, and platform engineering.
permalink: /writing/
---

## Featured

<div class="article-grid">
  {% for pub in site.data.publications.publications %}
  {% if pub.featured %}
  <a href="{{ pub.url }}" target="_blank" rel="noopener noreferrer" class="modern-card-link">
    <article class="article-card reveal">
      <p class="article-card__date">{{ pub.venue }} // {{ pub.date }}</p>
      <h3 class="article-card__title">{{ pub.title }}</h3>
      <p class="article-card__excerpt">{{ pub.description }}</p>
      <span class="article-card__read-more">Read on {{ pub.venue }} &rarr;</span>
    </article>
  </a>
  {% endif %}
  {% endfor %}
</div>

## Blog Posts

<div class="article-grid">
{% for post in site.posts %}
  <a href="{{ post.url | relative_url }}" class="modern-card-link">
    <article class="article-card reveal">
      <p class="article-card__date">{{ post.date | date: "%B %d, %Y" }}</p>
      <h3 class="article-card__title">{{ post.title }}</h3>
      {% if post.excerpt %}
      <p class="article-card__excerpt">{{ post.excerpt | strip_html | truncate: 150 }}</p>
      {% endif %}
      <span class="article-card__read-more">Read more &rarr;</span>
    </article>
  </a>
{% endfor %}
</div>

## More Writing

<div class="writing-links mt-8">
  <a href="https://aiwithshrey.hashnode.dev" target="_blank" rel="noopener noreferrer" class="btn btn--primary">
    Read on Hashnode
  </a>
</div>
