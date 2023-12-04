import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/model/post';

@Component({
	selector: 'app-post-preview',
	templateUrl: './post-preview.component.html',
})
export class PostPreviewComponent {

	@Input() page: string | undefined;
	@Input() posts: Post[] | undefined | null;

	postByName(name: string | undefined) {
		if (name) {
			return this.posts?.filter(item => item.page.includes(name))
				.sort((a, b) => b.date.localeCompare(a.date))
				.sort((a, b) => b.title.localeCompare(a.title))
		}
		return [];
	}

}
