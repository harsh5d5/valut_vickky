'use client';

import { useState, useEffect } from 'react';
import styles from "./page.module.css";
import { VaultItem, Category } from "@/lib/types";
import { api } from "@/lib/api";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Category | 'Home'>('Home');
  const [items, setItems] = useState<VaultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Category>('Idea');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const data = await api.getItems();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async () => {
    if (!title.trim()) return;

    try {
      const newItemData = {
        title: title,
        description: description || 'No description provided.',
        category: category,
        date: date
      };

      const savedItem = await api.createItem(newItemData);
      setItems([savedItem, ...items]);

      // Reset Form
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Failed to save to database. Is the backend running?");
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this from your Vault?")) return;
    try {
      await api.deleteItem(id);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const filteredItems = activeTab === 'Home'
    ? items
    : items.filter(item => item.category === activeTab);

  return (
    <div className={styles.container}>
      <nav className={styles.navWrapper}>
        <div className={styles.logoCircle}>
          <span className={styles.logoIcon}>V</span>
        </div>
        <div className={styles.nav}>
          {['Home', 'Task', 'Idea', 'Payment'].map((tab) => (
            <div
              key={tab}
              className={`${styles.navItem} ${activeTab === tab ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab === 'Task' ? 'Tasks' : tab === 'Idea' ? 'Ideas' : tab}
            </div>
          ))}
        </div>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.brand}>Vault<span>.</span></h1>
        <p className={styles.subtitle}>A dedicated workspace for your creative process.</p>
      </header>


      <section className={styles.creatorCard}>
        <h2 className={styles.creatorTitle}>Create New Entry</h2>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Title</label>
            <input
              className={styles.creatorInput}
              placeholder="Give your idea a name..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Date</label>
            <input
              type="date"
              className={styles.creatorInput}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <label className={styles.label}>Description</label>
            <textarea
              className={`${styles.creatorInput} ${styles.creatorTextarea}`}
              placeholder="Write down the details here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formFooter}>
          <div className={styles.categorySelector}>
            {(['Idea', 'Task', 'Payment'] as Category[]).map((cat) => (
              <button
                key={cat}
                className={`${styles.catBtn} ${category === cat ? `${styles.catBtnActive} ${styles['active' + cat]}` : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <button className={styles.saveButton} onClick={addItem}>Save to Vault</button>
        </div>
      </section>


      <main className={styles.list}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading your Vault...</div>
        ) : filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No entries found yet.</div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={`${styles.accentLine} ${item.category === 'Idea' ? styles.accentIdea :
                item.category === 'Task' ? styles.accentTask :
                  styles.accentPayment
                }`} />

              <div className={styles.info}>
                <div className={styles.titleRow}>
                  <h2 className={styles.cardTitle}>{item.title}</h2>
                  <span className={`${styles.categoryTag} ${item.category === 'Idea' ? styles.tagIdea :
                    item.category === 'Task' ? styles.tagTask :
                      styles.tagPayment
                    }`}>
                    {item.category}
                  </span>
                </div>
                <p className={styles.cardContent}>{item.description}</p>
              </div>

              <div className={styles.cardFooter}>
                <span>{item.date}</span>
              </div>

              <button
                className={styles.deleteBtn}
                onClick={() => deleteItem(item.id)}
                title="Delete Entry"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          )
          ))}
      </main>
    </div>
  );
}
