# UBC Debates

A thin branded application of [Live Debate Engine](https://github.com/neophilism/Live-Debate-Engine).
The UBC-01 foundation builds an offline browser shell with overview, program,
debate, speaker and participant navigation. Engine integration is unverified;
the shell shows unavailable states and grants no participant session or access.

With Node 24:

```sh
npm ci --offline --ignore-scripts
npm run check
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

Open `http://127.0.0.1:8000/`. See [application boundaries, component contracts and
build instructions](docs/APPLICATION_BOUNDARY.md). The canonical approved work
plan remains [registry/prs.json](registry/prs.json); UBC-02 through UBC-08 are pending.
The local presentation contract is versioned separately from the engine's future
verified API/SDK dependency. No engine source is copied into this app.

## End-to-End Everywhere progress

[security/e2eesa-status.json](security/e2eesa-status.json) records standard
implementation, complete testing and independent expert review separately.
Read [adoption and independent-account instructions](docs/E2EESA_ADOPTION.md)
and run `python3 scripts/validate_e2eesa_status.py`. A foundation build does not
establish product security, real upstream readiness or certification.
