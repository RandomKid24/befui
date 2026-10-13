import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';

const products = [
  { title: 'Analytics', text: 'Traffic, funnels and reports in one place.' },
  { title: 'Automations', text: 'Run steps when something changes.' },
  { title: 'Integrations', text: 'Connect the tools your team already uses.' },
];

export default function NavigationMenuDemo() {
  return (
    <div className="min-h-72 w-full">
      <div className="flex justify-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-80 gap-1">
                  {products.map((p) => (
                    <li key={p.title}>
                      <NavigationMenuLink href={`#${p.title.toLowerCase()}`}>
                        <span className="block font-medium">{p.title}</span>
                        <span className="block text-[13px] text-muted-foreground">{p.text}</span>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-64 gap-1">
                  <li><NavigationMenuLink href="#docs">Documentation</NavigationMenuLink></li>
                  <li><NavigationMenuLink href="#guides">Guides</NavigationMenuLink></li>
                  <li><NavigationMenuLink href="#changelog">Changelog</NavigationMenuLink></li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#pricing" className={navigationMenuTriggerStyle}>Pricing</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
