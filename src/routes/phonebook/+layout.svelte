<div class="container">
    <div class="header">
        <div class="logo-text-container">
            <img src="/phonebook.png" class="logo" alt="logo" />
            <p>
                <span class="bold">My Contacts</span>
            </p>
        </div>
    </div>
    <slot />
</div>

<style>
    .logo {
        height: 150px;
    }

    .bold {
        font-size: xx-large;
        font-weight: 600;
    }

    .logo-text-container {
        display: flex;
        align-items: center;
    }
</style>