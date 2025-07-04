import matplotlib.pyplot as plt

# Define the steps
steps = [
    "Raise Awareness",
    "Acquire Users\n(10,000+)",
    "Build Partnerships",
    "Establish Trust",
    "Foster Loyalty & Engagement"
]

# Create figure and axis
fig, ax = plt.subplots(figsize=(12, 2))
ax.axis('off')

# Define positions for each step (evenly spaced horizontally)
x_positions = range(len(steps))

# Plot the steps as text boxes
for x, step in zip(x_positions, steps):
    ax.text(x, 0.5, step, ha='center', va='center', fontsize=12,
            bbox=dict(boxstyle="round,pad=0.5", facecolor="#AED6F1", edgecolor="#2980B9"))

# Draw arrows between steps
for i in range(len(steps) - 1):
    ax.annotate('',
                xy=(x_positions[i+1] - 0.2, 0.5),
                xytext=(x_positions[i] + 0.2, 0.5),
                arrowprops=dict(arrowstyle="->", color="#2980B9", lw=2))

plt.tight_layout()
plt.show()
