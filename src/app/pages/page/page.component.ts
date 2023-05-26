import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, combineLatestWith, map, mergeMap, Observable } from 'rxjs';
import { Page } from 'src/app/model/page';
import { Post } from 'src/app/model/post';
import { PagesService } from 'src/app/service/pages.service';
import { StateService } from 'src/app/service/state.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
})
export class PageComponent implements OnInit {

  page$: Observable<string> | undefined;
  content$: Observable<string> | undefined;
  posts$: Observable<Post[]> | undefined;
  pages$: Observable<Page[]> | undefined;

  constructor(private route: ActivatedRoute, private stateService: StateService, private pagesService: PagesService) { 
  }

  ngOnInit(): void {
	this.page$ = this.route.params.pipe(
		map(item => item['page']),
		map(item => item === undefined ? 'index' : item)
	);
    this.posts$ = this.stateService.posts;
    this.pages$ = this.stateService.pages;
    const fileName = this.page$?.pipe(combineLatestWith(this.pages$!), map(([page, pages]) => this.filterFilename(pages, page)));
    this.content$ = fileName?.pipe(mergeMap(file => this.pagesService.loadPageContent(file)))
  }

  filterFilename(item: Page[], name: string) {

    return item.filter(page => (page as Page).page.includes(name))
      .map(page => page.file)
      .reduce(file => file);
  }

}
