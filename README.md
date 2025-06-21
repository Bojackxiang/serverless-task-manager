# 🧩 Serverless Task Management System

A full-stack task management platform built using the **Serverless architecture** on AWS. The system uses **Node.js + Express.js** for backend logic, hosted on **AWS Lambda**, and a **Next.js** frontend deployed on platforms like **Vercel**. Infrastructure is provisioned via **AWS SAM**, and the deployment pipeline is automated with **GitHub Actions**.

---

## 📌 Features

- ✅ Task creation, listing, editing, and deletion (CRUD)
- 📤 File upload with pre-signed S3 URLs
- ✅ Approval workflow using AWS Step Functions
- ⏰ Scheduled task expiration with EventBridge
- 🚀 Serverless deployment with AWS Lambda
- 🔄 CI/CD pipeline with GitHub Actions

---

## 🏗️ Tech Stack

| Layer       | Technology                                |
|------------|--------------------------------------------|
| Frontend   | [Next.js](https://nextjs.org/)             |
| Backend    | [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) |
| Infrastructure | [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) |
| Deployment | [GitHub Actions](https://github.com/features/actions) |
| Cloud Services | AWS Lambda, API Gateway, S3, DynamoDB, Step Functions, EventBridge |

---

## 📁 Project Structure
