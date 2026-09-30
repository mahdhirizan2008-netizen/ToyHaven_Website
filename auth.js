function setupAuth() {
    const signupForm =
        document.getElementById(
            'signupForm'
        );

    const loginForm =
        document.getElementById(
            'loginForm'
        );

    if (signupForm) {

        signupForm.addEventListener(
            'submit',
            (event) => {

                event.preventDefault();

                const details =
                    Object.fromEntries(
                        new FormData(
                            signupForm
                        )
                    );

                if (
                    details.password !==
                    details.confirm
                ) {

                    showToast(
                        'Please make sure both passwords match.'
                    );

                    return;
                }

                writeStore(
                    'toyUser',
                    {
                        name:
                            details.name,

                        email:
                            details.email,

                        password:
                            details.password
                    }
                );

                signupForm.reset();

                showToast(
                    "Welcome to the Toy Haven family! We're happy to have you here. 🎈"
                );
            }
        );
    }

    if (loginForm) {

        loginForm.addEventListener(
            'submit',
            (event) => {

                event.preventDefault();

                const details =
                    Object.fromEntries(
                        new FormData(
                            loginForm
                        )
                    );

                const user =
                    readStore(
                        'toyUser',
                        null
                    );

                if (
                    user &&
                    user.email ===
                        details.email &&
                    user.password ===
                        details.password
                ) {

                    showToast(
                        'Welcome back to Toy Haven! ✨'
                    );

                } else {

                    showToast(
                        'We could not find that demo account. Please check your details.'
                    );
                }
            }
        );
    }
}

document.addEventListener(
    'DOMContentLoaded',
    setupAuth
);
