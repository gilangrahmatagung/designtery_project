import { Link } from '@inertiajs/react';
import { ExternalLink, FolderOpen, NotebookPen, Terminal } from 'lucide-react';
import OpsController from '@/actions/App/Http/Controllers/Admin/OpsController';
import CategoryController from '@/actions/App/Http/Controllers/Blog/CategoryController';
import PostController from '@/actions/App/Http/Controllers/Blog/PostController';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { home } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Posts',
        href: PostController.index.url(),
        icon: NotebookPen,
    },
    {
        title: 'Categories',
        href: CategoryController.index.url(),
        icon: FolderOpen,
    },
    {
        title: 'System & Ops',
        href: OpsController.index.url(),
        icon: Terminal,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                {/*<SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <AppLogo />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>*/}
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={home()} prefetch target="_blank" rel="noopener noreferrer">
                                <ExternalLink />
                                <span>See public pages</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
