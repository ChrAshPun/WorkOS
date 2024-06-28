References:
https://www.youtube.com/watch?v=SvppXbpv-5k&t=187s
https://www.cloudflare.com/learning/access-management/what-is-saml/
https://www.ibm.com/blog/open-standards-vs-open-source-explanation/
https://www.cloudflare.com/learning/access-management/what-is-saml/
https://workos.com/blog/saml-2-vs-saml1#:~:text=A%20SAML%20binding%20defines%20how,communication%20between%20IdP%20and%20SP.


## What is SAML?
SAML stands for Security Assertion Markup Language is an open standard for exchanging authentication and authorization data between an identity provider (IdP) and a service provider. It is commonly used for implementing Single Sign-On.

SAML makes single sign-on (SSO) technology possible by providing a way to authenticate a user once and then communicate that authentication to multiple applications. The most current version of SAML is SAML 2.0.

The SAML Protocol has 3 Entities:
- User Agent/Principal/Subject - The user who is trying to gain access to the application.
- Service Provider - The application or service the user is trying to gain access to.
- The IdP or Identity Provider - which is what stores identity data, authenticates and authorizes us nd generates the SAML assertion for the Service Provider. 

2 Flows
- IdP-Initiated flow
- SP-Inititated flow

## SP-initiated SSO vs IdP-initiated SSO

SPs and IdPs work together to facilitate SSO.

In IdP-initiated SSO, the user logs in to their IdP first and then selects the app they want to log in to from a menu. While in SP-initiated SSO, the user logs in directly from the app which then redirects them to the IdP.

## SP-initiated SSO
SP-initiated SSO is ideal if you want to offer multiple login options to different IdPs.

With “Sign In With” type of identity providers like Apple or Google, the SP typically exposes a login button, which, when clicked redirects the user to the IdP for authentication.

...the SP usually has an input box where the user is asked to enter their email address. Upon entering their email, the SP  determines which IdP (if any) the user uses and redirects them to it.

User click a login button > SP redirects to the IdP > IdP verifies the user and generates a token/SAML assertion > IdP redirects user to the SP > the SP validates that the res is from the trusts IdP > If valid, user is granted access

## IdP-initiated SSO
IdP-initiated SSO is initiated from the IdP. Once a user logs in to their IdP, they can select the specific app they want to log in from a list of several SPs — to which the IdP redirects them. This could be a corporate login portal or any other system that the organization uses to manage user app access.

The user logs into the IdP's portal > after authentication, the user selects SP they wish to access from dashboard > IdP generates a token > IdP sends the user, along with the token, directly to the SP > SP receives the token, validates it, and grants access to the user

IdP-initiated SSO is mostly used in enterprise environments where employees access a suite of apps through a corporate IdP.

***Note*** It is the User Agent that acts as the transport mechanism for the SAML Assertion. (See the idp-init.png)

## What is "open standard"?
An "open standard" in the context of SAML (Security Assertion Markup Language) refers to a publicly available set of specifications and protocols that are developed, maintained, and agreed upon by a collaborative community or standards organization. 

Take a common example. Have you ever noticed that Wi-Fi seems to work the same with any router, phone or computer? We tend to take these types of standards for granted, but they bring huge benefits to our daily lives.

Imagine if there were no standards like Wi-Fi. Every business might have its own form of wireless technology. If your favorite coffee shop had a router made by Company X, and you owned a computer made by Company Y, you might have to find another coffee shop to check your email.

## What is SAML assertion?
What the IdP authorizes a user, it will generate a SAML assertion and send it to the Service Provider. The user will be able to Single-Sign On to other applications.

The SAML will includes a user identifier or NameID and will sign the assertion so the Service Provider can trust it.

The IdP and SP must agree on a SAML Configuration.

## What are SAML 2.0 Bindings?
https://workos.com/blog/saml-2-vs-saml1#:~:text=A%20SAML%20binding%20defines%20how,communication%20between%20IdP%20and%20SP.

A SAML binding defines how information is transmitted between the IdP and the SPs.

SAML 1.1 explicitly defines the SAML SOAP (Simple Object Access Protocol) binding. This binding is used to transport SAML messages within SOAP envelopes, typically for back-channel communication between IdP and SP.

SAML 2.0 refined and standardized these bindings. For Web Browser SSO, the most commonly used bindings are HTTP Redirect and HTTP POST binding:

- HTTP Redirect (GET) binding: Allows SAML requests and responses to be transmitted in the URL. This binding is suitable for short messages since URL length is limited.

- HTTP POST binding: SAML messages are sent in HTTP POST requests. Suitable for longer messages, for example those containing signed or encrypted assertions. This is the most commonly supported binding.

## What is a "callback" function?

A callback is a function that is passed as an argument to another function and is executed within that function at some point in time. Callbacks are commonly used to handle asynchronous operations, manage events, or customize the behavior of other functions.

## What is ACS URL?
An Assertion Consumer Service URL (ACS URL) is an endpoint where an identity provider posts SAML responses.

## Why choose WorkOS over open source solutions like KeyCloak?
Open source solutions have a steeper learning curve and typically provide little guidance or customer support. WorkOS works out of the box and is ideal for businesses that need to get up and running quickly. Also SDKs or software development kits usually have built-in features that might be difficult for an inexperience developer to implement. WorkOS also provides AuthKit which abstracts the complexity of having to design the UI.

If you're okay with taking the time to learn how to use the open source solution and don't have a strict deadline or a high budget, open source would be a practical choice. However, WorkOS will get you up and running quicker, has excellent documentation, and offers 24/7 customer support.