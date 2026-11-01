# UBC-01 application boundary

The browser application owns UBC branding, navigation and presentation. Live
Debate Engine owns competitions, event contracts, rules, scheduling, scoring,
admission, participant identity/permissions, media and authoritative records.
No engine implementation, database, authorization rule or copied SDK is included
in this repository's foundation.

## Versions and dependency status

`src/contracts.js` exports presentation contract **1**. This is a local component
contract, not an assertion that the engine supports an API version called v1.
The source dependency is `neophilism/Live-Debate-Engine`. Its accepted immutable
revision and API version remain `null`, and integration is `unverified`. The
foundation cannot enable network access by setting a URL or editing an environment
variable. No endpoint or upstream readiness was inferred from earlier messages.

UBC-03 must inspect the actual engine API/SDK and readiness evidence, record an
immutable source revision and supported version, then implement its adapter with
scoped authentication, response validation, cancellation and negative tests.
Do not vendor or fork the engine to make that integration appear complete.
UBC-04 owns protected participant sessions and server-side authorization.

## Routes and components

| Hash route | Component contract | Foundation behavior |
| --- | --- | --- |
| `#/` | Overview | Branded entry and honest engine availability |
| `#/program` | Program view | Unavailable until integration |
| `#/debates` | Debate list | Unavailable until integration |
| `#/speakers` | Speaker list | Unavailable until integration |
| `#/participant` | Participant entry | Sign-in unavailable; no session/role claimed |
| Anything else | Not found | Fixed message; no raw hash reflection |

The engine boundary returns `{contractVersion:1,state:'unavailable',
reason:'engine_not_connected',data:null}`. Components reject unsupported versions
and fabricated success data. There is no network adapter, credential storage,
login form, sample public debate, or client-side permission grant. The application
uses text nodes, fixed navigation and local assets. CSP denies connections,
inline scripts and form submissions. A host should also set suitable response
headers before release, including frame-ancestors (not supported by meta CSP).

## Source and build

Node 24, npm and the standard library are sufficient; there are no runtime or
development package dependencies. `npm ci --offline --ignore-scripts` needs no
provider account or network. `npm run check` runs the unit/negative/build suite
and builds `dist/` from the four explicit files in `src/`. The build parses both
JavaScript modules and emits a deterministic SHA-256 asset manifest. It does not
read environment values into the browser bundle, fetch dependencies, contact the
engine or deploy. Build into a clean output directory for release.

Serve the generated directory with a static server, for example
`python3 -m http.server 8000 --bind 127.0.0.1 --directory dist`, then open
`http://127.0.0.1:8000/`. Hash navigation needs no server rewrite. UBC-07 will add
product CI and deployment qualification under the protected workflow policy.

## Evidence and remaining work

Five local tests cover fixed routes, unavailable/protected states, version
rejection, navigation/focus through a DOM test fixture, and deterministic clean
builds with secret exclusion. These are not real browser accessibility tests,
production security certification or evidence of an authenticated engine flow.
UBC-02 through UBC-08 remain separate approved work. No real data, deployment,
provider, schedule, permission, dependency or spending change is part of UBC-01.
