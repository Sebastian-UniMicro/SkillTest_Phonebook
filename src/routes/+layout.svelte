<div class="container">
	<div class="header">
		<img src="/logo.png" class="logo" alt="logo" />
		<p>
			Welcome to the <span class="bold">SvelteKit</span> starter project!
		</p>
	</div>

	<slot />
</div>

<style>
	@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800&display=swap");

	:global(body) {
		font-family: "Inter";
	}

	.container {
		position: relative;
		padding: 100px 15%;
	}

	.logo {
		width: 150px;
	}

	.header {
		margin-bottom: 4rem;
	}

	.bold {
        font-weight: 600;
    }
</style>
