    import { createContext, useContext, useState, ReactNode } from 'react';
import { ChevronLeft, Code2, ChevronDown, ChevronRight, X, Check, Star } from 'lucide-react';
import { ProjectComponentProps } from '../../types';

// ==================== ACCORDION COMPOUND COMPONENT ====================

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion compound components must be used within Accordion');
  }
  return context;
}

// Composant principal Accordion
interface AccordionProps {
  children: ReactNode;
  allowMultiple?: boolean;
}

function Accordion({ children, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      return allowMultiple ? [...prev, id] : [id];
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className="space-y-2">
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// Accordion.Item
interface AccordionItemProps {
  children: ReactNode;
  id: string;
}

Accordion.Item = function AccordionItem({ children, id }: AccordionItemProps) {
  return <div className="border border-gray-200 rounded-lg overflow-hidden">{children}</div>;
};

// Accordion.Header
interface AccordionHeaderProps {
  children: ReactNode;
  id: string;
}

Accordion.Header = function AccordionHeader({ children, id }: AccordionHeaderProps) {
  const { openItems, toggleItem } = useAccordionContext();
  const isOpen = openItems.includes(id);

  return (
    <button
      onClick={() => toggleItem(id)}
      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
    >
      <span className="font-semibold text-gray-800">{children}</span>
      <ChevronDown
        className={`text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        size={20}
      />
    </button>
  );
};

// Accordion.Content
interface AccordionContentProps {
  children: ReactNode;
  id: string;
}

Accordion.Content = function AccordionContent({ children, id }: AccordionContentProps) {
  const { openItems } = useAccordionContext();
  const isOpen = openItems.includes(id);

  if (!isOpen) return null;

  return (
    <div className="p-4 bg-white">
      {children}
    </div>
  );
};

// ==================== TABS COMPOUND COMPONENT ====================

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within Tabs');
  }
  return context;
}

interface TabsProps {
  children: ReactNode;
  defaultTab: string;
}

function Tabs({ children, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="space-y-4">
        {children}
      </div>
    </TabsContext.Provider>
  );
}

Tabs.List = function TabsList({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 border-b border-gray-200">
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  children: ReactNode;
  value: string;
}

Tabs.Trigger = function TabsTrigger({ children, value }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 font-medium transition-all ${
        isActive
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-600 hover:text-gray-800'
      }`}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  children: ReactNode;
  value: string;
}

Tabs.Content = function TabsContent({ children, value }: TabsContentProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) return null;

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      {children}
    </div>
  );
};

// ==================== MODAL COMPOUND COMPONENT ====================

interface ModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal compound components must be used within Modal');
  }
  return context;
}

interface ModalProps {
  children: ReactNode;
}

function Modal({ children }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false)
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

Modal.Trigger = function ModalTrigger({ children }: { children: ReactNode }) {
  const { open } = useModalContext();

  return (
    <button
      onClick={open}
      className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all font-semibold"
    >
      {children}
    </button>
  );
};

Modal.Content = function ModalContent({ children }: { children: ReactNode }) {
  const { isOpen, close } = useModalContext();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={close}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {children}
      </div>
    </div>
  );
};

Modal.Header = function ModalHeader({ children }: { children: ReactNode }) {
  const { close } = useModalContext();

  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800">{children}</h2>
      <button
        onClick={close}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <X size={24} className="text-gray-600" />
      </button>
    </div>
  );
};

Modal.Body = function ModalBody({ children }: { children: ReactNode }) {
  return <div className="p-6">{children}</div>;
};

Modal.Footer = function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 justify-end p-6 border-t border-gray-200">
      {children}
    </div>
  );
};

// ==================== MENU COMPOUND COMPONENT ====================

interface MenuContextValue {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenuContext() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('Menu compound components must be used within Menu');
  }
  return context;
}

function Menu({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MenuContext.Provider
      value={{
        isOpen,
        toggle: () => setIsOpen(prev => !prev),
        close: () => setIsOpen(false)
      }}
    >
      <div className="relative inline-block">
        {children}
      </div>
    </MenuContext.Provider>
  );
}

Menu.Button = function MenuButton({ children }: { children: ReactNode }) {
  const { toggle } = useMenuContext();

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      {children}
      <ChevronDown size={16} />
    </button>
  );
};

Menu.Items = function MenuItems({ children }: { children: ReactNode }) {
  const { isOpen } = useMenuContext();

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-2">
      {children}
    </div>
  );
};

interface MenuItemProps {
  children: ReactNode;
  onClick?: () => void;
}

Menu.Item = function MenuItem({ children, onClick }: MenuItemProps) {
  const { close } = useMenuContext();

  const handleClick = () => {
    onClick?.();
    close();
  };

  return (
    <button
      onClick={handleClick}
      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-2"
    >
      {children}
    </button>
  );
};

// ==================== COMPOSANT PRINCIPAL ====================
export default function CompoundComponentsProject({ onBack }: ProjectComponentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 p-8">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <ChevronLeft size={20} />
        Retour à l'accueil
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Compound Components</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Compound Components", "Context API", "Composition"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {/* EXEMPLE 1: ACCORDION */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ChevronRight className="text-blue-500" size={28} />
                1. Accordion Component
              </h2>

              <Accordion allowMultiple={true}>
                <Accordion.Item id="item1">
                  <Accordion.Header id="item1">
                    Qu'est-ce qu'un Compound Component ?
                  </Accordion.Header>
                  <Accordion.Content id="item1">
                    <p className="text-gray-700">
                      Un Compound Component est un pattern où plusieurs composants travaillent ensemble
                      pour créer une fonctionnalité complète. Ils partagent un état implicite via Context.
                    </p>
                  </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item id="item2">
                  <Accordion.Header id="item2">
                    Pourquoi utiliser ce pattern ?
                  </Accordion.Header>
                  <Accordion.Content id="item2">
                    <ul className="list-disc ml-5 space-y-1 text-gray-700">
                      <li>API plus flexible et expressive</li>
                      <li>Inversion of control - l'utilisateur contrôle le markup</li>
                      <li>Séparation des responsabilités</li>
                      <li>Code plus lisible et maintenable</li>
                    </ul>
                  </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item id="item3">
                  <Accordion.Header id="item3">
                    Exemples connus
                  </Accordion.Header>
                  <Accordion.Content id="item3">
                    <p className="text-gray-700 mb-2">
                      Des bibliothèques populaires utilisent ce pattern :
                    </p>
                    <ul className="list-disc ml-5 space-y-1 text-gray-700">
                      <li>React Router (&lt;Routes&gt;, &lt;Route&gt;)</li>
                      <li>Radix UI (tous les composants)</li>
                      <li>Reach UI</li>
                      <li>HTML natif (&lt;select&gt;, &lt;option&gt;)</li>
                    </ul>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>

              <div className="mt-4 bg-blue-50 rounded p-4 text-sm text-gray-700">
                <p className="font-mono text-xs mb-2">
                  {'<Accordion>\n  <Accordion.Item>\n    <Accordion.Header>Title</Accordion.Header>\n    <Accordion.Content>Content</Accordion.Content>\n  </Accordion.Item>\n</Accordion>'}
                </p>
                <p>💡 Les sous-composants communiquent via Context sans props explicites</p>
              </div>
            </div>

            {/* EXEMPLE 2: TABS */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                2. Tabs Component
              </h2>

              <Tabs defaultTab="profile">
                <Tabs.List>
                  <Tabs.Trigger value="profile">Profil</Tabs.Trigger>
                  <Tabs.Trigger value="settings">Paramètres</Tabs.Trigger>
                  <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="profile">
                  <h3 className="font-bold text-gray-800 mb-2">Mon Profil</h3>
                  <p className="text-gray-700 mb-4">
                    Gérez vos informations personnelles et votre présence en ligne.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      JD
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">John Doe</div>
                      <div className="text-sm text-gray-600">john@example.com</div>
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content value="settings">
                  <h3 className="font-bold text-gray-800 mb-2">Paramètres</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-gray-700">Mode sombre</span>
                      <input type="checkbox" className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-gray-700">Notifications push</span>
                      <input type="checkbox" className="w-5 h-5" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-gray-700">Emails marketing</span>
                      <input type="checkbox" className="w-5 h-5" />
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content value="notifications">
                  <h3 className="font-bold text-gray-800 mb-2">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3 p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                      <Check className="text-blue-500 flex-shrink-0" size={20} />
                      <div>
                        <div className="font-medium text-gray-800">Compte vérifié</div>
                        <div className="text-sm text-gray-600">Il y a 2 heures</div>
                      </div>
                    </div>
                    <div className="flex gap-3 p-3 bg-yellow-50 rounded border-l-4 border-yellow-500">
                      <Star className="text-yellow-500 flex-shrink-0" size={20} />
                      <div>
                        <div className="font-medium text-gray-800">Nouveau badge obtenu</div>
                        <div className="text-sm text-gray-600">Hier</div>
                      </div>
                    </div>
                  </div>
                </Tabs.Content>
              </Tabs>

              <div className="mt-4 bg-green-50 rounded p-4 text-sm text-gray-700">
                <p>💡 Les Tabs utilisent Context pour synchroniser l'état entre List et Content</p>
              </div>
            </div>

            {/* EXEMPLE 3: MODAL */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                3. Modal Component
              </h2>

              <Modal>
                <Modal.Trigger>Ouvrir la Modal</Modal.Trigger>

                <Modal.Content>
                  <Modal.Header>Confirmation</Modal.Header>
                  <Modal.Body>
                    <p className="text-gray-700 mb-4">
                      Êtes-vous sûr de vouloir continuer cette action ? Cette opération est irréversible.
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        ⚠️ Cette action supprimera définitivement vos données.
                      </p>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Modal.Trigger>
                      <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                        Annuler
                      </button>
                    </Modal.Trigger>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                      Confirmer
                    </button>
                  </Modal.Footer>
                </Modal.Content>
              </Modal>

              <div className="mt-4 bg-purple-50 rounded p-4 text-sm text-gray-700">
                <p>💡 Modal.Trigger peut être utilisé plusieurs fois (ouvrir/fermer)</p>
              </div>
            </div>

            {/* EXEMPLE 4: DROPDOWN MENU */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                4. Dropdown Menu
              </h2>

              <div className="flex gap-4">
                <Menu>
                  <Menu.Button>Actions</Menu.Button>
                  <Menu.Items>
                    <Menu.Item onClick={() => alert('Éditer')}>
                      ✏️ Éditer
                    </Menu.Item>
                    <Menu.Item onClick={() => alert('Dupliquer')}>
                      📋 Dupliquer
                    </Menu.Item>
                    <Menu.Item onClick={() => alert('Archiver')}>
                      📦 Archiver
                    </Menu.Item>
                    <hr className="my-2 border-gray-200" />
                    <Menu.Item onClick={() => alert('Supprimer')}>
                      <span className="text-red-600">🗑️ Supprimer</span>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>

                <Menu>
                  <Menu.Button>Exporter</Menu.Button>
                  <Menu.Items>
                    <Menu.Item onClick={() => alert('PDF')}>
                      📄 PDF
                    </Menu.Item>
                    <Menu.Item onClick={() => alert('Excel')}>
                      📊 Excel
                    </Menu.Item>
                    <Menu.Item onClick={() => alert('CSV')}>
                      📋 CSV
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>

              <div className="mt-4 bg-orange-50 rounded p-4 text-sm text-gray-700">
                <p>💡 Chaque Menu gère son propre état indépendamment</p>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-8 bg-violet-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-violet-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>Compound Components</strong>: Composants qui travaillent ensemble
              </li>
              <li>
                • <strong>Context API</strong>: Partage d'état implicite entre composants
              </li>
              <li>
                • <strong>Static Properties</strong>: Component.SubComponent pattern
              </li>
              <li>
                • <strong>Inversion of Control</strong>: L'utilisateur contrôle la structure
              </li>
              <li>
                • <strong>Flexible API</strong>: Composer comme des blocs LEGO
              </li>
              <li>
                • <strong>Encapsulation</strong>: État et logique cachés dans le parent
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4 space-y-3">
              <p className="text-sm text-gray-600 font-mono">
                // Pattern de base
              </p>
              <p className="text-sm text-gray-600 font-mono">
                {'const Context = createContext();'}
              </p>
              <p className="text-sm text-gray-600 font-mono">
                {'function Parent({ children }) {'}
              </p>
              <p className="text-sm text-gray-600 font-mono ml-4">
                {'return <Context.Provider>...</Context.Provider>;'}
              </p>
              <p className="text-sm text-gray-600 font-mono">
                {'}'}
              </p>
              <p className="text-sm text-gray-600 font-mono mt-2">
                {'Parent.Child = function Child() { ... };'}
              </p>
            </div>

            <div className="mt-4 bg-green-50 rounded p-4 text-sm text-green-800">
              <p className="font-bold mb-2">✅ Avantages:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>API déclarative et intuitive</li>
                <li>Flexibilité maximale de composition</li>
                <li>Séparation claire des responsabilités</li>
                <li>Évite le "props drilling"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}