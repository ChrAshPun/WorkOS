References:
https://www.youtube.com/watch?v=SvppXbpv-5k&t=187s
https://www.cloudflare.com/learning/access-management/what-is-saml/
https://www.ibm.com/blog/open-standards-vs-open-source-explanation/
https://www.cloudflare.com/learning/access-management/what-is-saml/


## What is SAML?

SAML or Security Assertion Markup Language is the technical standard used by SSO providers to communicate that a user is authenticated. 
SAML makes single sign-on (SSO) technology possible by providing a way to authenticate a user once and then communicate that authentication to multiple applications. The most current version of SAML is SAML 2.0.

## What is "open standard"?
From ChatGPT:
An "open standard" in the context of SAML (Security Assertion Markup Language) refers to a publicly available set of specifications and protocols that are developed, maintained, and agreed upon by a collaborative community or standards organization. 

Take a common example. Have you ever noticed that Wi-Fi seems to work the same with any router, phone or computer? We tend to take these types of standards for granted, but they bring huge benefits to our daily lives.

Imagine if there were no standards like Wi-Fi. Every business might have its own form of wireless technology. If your favorite coffee shop had a router made by Company X, and you owned a computer made by Company Y, you might have to find another coffee shop to check your email.

## The SAML Protocol has 3 Entities

### User Agent/Principal/Subject
This is almost always a human user who is trying to access a cloud-hosted application.

### Service Provider
The application or service the user is trying to gain access to.

### Identity Provider
An identity provider (IdP) stores and manages users' digital identities. Think of an IdP as being like a guest list, but for digital and cloud-hosted applications instead of an event.

The Service Provider and the Identity Provider establish a trust relationship with each other. The IdP handles authentication and authorizations.

The IdP will know about the Service Providers users and their attributes. The Service Provider will have it's only data on the same users.

## What is SAML assertion?
What the IdP authorizes a user, it will generate a SAML assertion and send it to the Service Provider. The user will be able to Single-Sign On to other applications.

The SAML will includes a user identifier or NameID and will sign the assertion so the Service Provider can trust it.

Both sides, the IdP and SP must agree on a SAML Configuration.

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