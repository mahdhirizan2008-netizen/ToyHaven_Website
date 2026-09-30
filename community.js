function setupFeedback() {
    const form = document.getElementById('feedbackForm');

    if (!form) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const details =
            Object.fromEntries(
                new FormData(form)
            );

        const feedback =
            readStore('toyFeedback', []);

        feedback.push({
            ...details,
            date: new Date().toISOString()
        });

        writeStore(
            'toyFeedback',
            feedback
        );

        form.reset();

        showToast(
            'Thank you for your feedback! We hope to make Toy Haven even better. 💛'
        );
    });
}


function renderForum() {

    const box =
        document.getElementById('forumPosts');

    if (!box) {
        return;
    }

    const posts =
        readStore('toyForum', []);

    if (!posts.length) {

        box.innerHTML = `
            <article class="forum-post">

                <p class="eyebrow">
                    TOY HAVEN TEAM
                </p>

                <h3>
                    Welcome to Toy Talk
                </h3>

                <p>
                    What toy are you excited to discover this week?
                </p>

                <button
                    class="forum-like"
                    type="button">
                    ▲ 8 Helpful
                </button>

            </article>
        `;

        return;
    }

    box.innerHTML =
        posts.map(
            (post, index) => `

            <article class="forum-post">

                <p class="eyebrow">
                    ${post.topic}
                </p>

                <h3>
                    ${post.name}
                </h3>

                <p>
                    ${post.text}
                </p>

                <button
                    class="forum-like"
                    data-like-post="${index}"
                    type="button">

                    ▲ ${post.likes} Helpful

                </button>

                <div class="comment-list">

                    ${(post.comments || [])
                        .map(
                            (comment) => `
                            <p>
                                <strong>
                                    ${comment.name}:
                                </strong>

                                ${comment.text}
                            </p>
                        `
                        )
                        .join('')}

                </div>

                <form
                    class="forum-comment"
                    data-post="${index}">

                    <input
                        name="comment"
                        required
                        placeholder="Add a friendly comment">

                    <button
                        class="btn btn-soft"
                        type="submit">
                        Comment
                    </button>

                </form>

            </article>

        `
        ).join('');


    box
        .querySelectorAll('[data-like-post]')
        .forEach((button) => {

            button.addEventListener(
                'click',
                () => {

                    const storedPosts =
                        readStore(
                            'toyForum',
                            []
                        );

                    const post =
                        storedPosts[
                            Number(
                                button.dataset.likePost
                            )
                        ];

                    if (!post) {
                        return;
                    }

                    post.likes =
                        Number(post.likes || 0) + 1;

                    writeStore(
                        'toyForum',
                        storedPosts
                    );

                    renderForum();
                }
            );
        });


    box
        .querySelectorAll('.forum-comment')
        .forEach((form) => {

            form.addEventListener(
                'submit',
                (event) => {

                    event.preventDefault();

                    const storedPosts =
                        readStore(
                            'toyForum',
                            []
                        );

                    const details =
                        Object.fromEntries(
                            new FormData(form)
                        );

                    const post =
                        storedPosts[
                            Number(
                                form.dataset.post
                            )
                        ];

                    if (!post) {
                        return;
                    }

                    post.comments =
                        post.comments || [];

                    post.comments.push({
                        name: 'Visitor',
                        text: details.comment
                    });

                    writeStore(
                        'toyForum',
                        storedPosts
                    );

                    form.reset();

                    renderForum();

                    showToast(
                        'Your comment has been posted successfully!'
                    );
                }
            );

        });

}


function setupForum() {

    const form =
        document.getElementById('postForm');

    if (!form) {
        return;
    }

    form.addEventListener(
        'submit',
        (event) => {

            event.preventDefault();

            const details =
                Object.fromEntries(
                    new FormData(form)
                );

            const posts =
                readStore(
                    'toyForum',
                    []
                );

            posts.unshift({
                name: details.name,
                topic: details.topic,
                text: details.post,
                likes: 0,
                comments: []
            });

            writeStore(
                'toyForum',
                posts
            );

            form.reset();

            renderForum();

            showToast(
                'Your discussion has been posted. Welcome to Toy Talk! ✨'
            );
        }
    );
}


document.addEventListener(
    'DOMContentLoaded',
    () => {

        setupFeedback();
        setupForum();
        renderForum();

    }
);
