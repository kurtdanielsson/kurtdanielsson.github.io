import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Page } from 'src/app/model/page';
import { StateService } from 'src/app/service/state.service';

export interface DropDownPage {
	navbar: String
	pages: Page[]
}

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {

	showNavbar: boolean = false;
	pageNames$: Observable<String[]> | undefined;
	pages$: Observable<Page[]> | undefined;
	dropdowns$: Observable<DropDownPage[]> | undefined;


	constructor(private readonly router: Router, private readonly stateService: StateService) { }

	ngOnInit(): void {

		this.dropdowns$ = this.stateService.pages?.pipe(
			map(pages => pages.filter(page => !!page.navbar)),
			map(pages => this.convert(pages))
		);

		this.pages$ = this.stateService.pages?.pipe(
			map(pages => pages.filter(page => !page.navbar)),
			map(pages => pages.filter(page => !page.page.includes('index'))),
			map(item => item.sort((a, b) => b.page.localeCompare(a.page))));
	}

	toggle() {
		this.showNavbar = !this.showNavbar;
	}

	navigate(url: String) {
		this.showNavbar = false;
		this.router.navigate([url])
	}

	convert(pages: Page[]): DropDownPage[] {

		let map = new Map<String, Page[]>();

		pages.forEach(item => {
			if (!map.has(item.navbar)) {
				map.set(item.navbar, []);
			}
			map.get(item.navbar)?.push(item);
		})

		let dropDownPages: DropDownPage[] = [];

		for (let key of Array.from(map.keys())) {
			dropDownPages.push(
				{
					navbar: key,
					pages: map.get(key) ?? []
				}
			);
		}

		return dropDownPages;
	}

}

