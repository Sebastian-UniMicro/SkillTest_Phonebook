<div class="container">
	<div class="header">
		<img src="/phonebook.png" class="logo" alt="logo" />
		<p>
		<span class="bold">My Contacts</span>
		</p>
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
</style>