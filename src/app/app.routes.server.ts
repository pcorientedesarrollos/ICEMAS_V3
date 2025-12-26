import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
    // Return empty array to skip prerendering dynamic routes
    async getPrerenderParams() {
      return [];
    }
  }
];
