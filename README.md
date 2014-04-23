# Microsimulation of prostate cancer

This application simulates prostate cancer onset and progresion. Each individual of a population starts out as being healthy. This state is followed by either illness (localised cancer) or death by other causes. A localised cancer can progress into either locally advanced or diagnosed (DX) localised cancer unless preceded by death.

The application is defined in C and can be compiled into Javascript with Emscripten (with the `build` command). The Javascript version can then be run in a browser as a freestanding application.
